import { Injectable } from '@nestjs/common';
import PrismaErrorHandler from 'src/prisma-errors';
import { PrismaService } from 'src/prisma/prisma.service';
import { google, calendar_v3 } from 'googleapis';
import { Prisma } from '@prisma/client';

@Injectable()
export class CalendarService {
  private calendarApi: calendar_v3.Calendar;
  constructor(private readonly prisma: PrismaService) {
    this.initializeGoogleAuth().then((client) => {
      this.calendarApi = google.calendar({ version: 'v3' })
    });
  }

  private async initializeGoogleAuth() {
    const auth = new google.auth.GoogleAuth({
      keyFile: '/home/zolizoli110/meeting-table/backend/meeting-table-377209-3ca66e761039.json',
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    const client = await auth.getClient();
    google.options({ auth: client });
    return client;
  }


  //-----CALENDAR_LIST-----\\

  async calendarListSyncHandler() {
    try {
      let syncToken = await this.getCalendarListSyncToken();
      console.log(syncToken);

      if (!syncToken) {
        await this.fullCalendarListSync();
        console.log("full sync")
      } else {
        await this.incrementalCalendarListSync(syncToken);
        console.log("incremental sync")
      }
    } catch (error) {
      if (error.message.includes('Sync token is no longer valid')) {
        await this.fullCalendarListSync();
      } else {
        throw new Error(`Failed to synchronize calendars: ${error}`);
      }
    }
  }

  private async fullCalendarListSync() {
    const { data: { items: calendars, nextSyncToken } } = await this.calendarApi.calendarList.list();

    this.updateCalendarListSyncToken(nextSyncToken);
    console.log(calendars)

    for await (const calendar of calendars) {
      await this.updateOrCreateCalendar(calendar);
      await this.eventSyncHandler(calendar.id);
    }
  }

  private async incrementalCalendarListSync(syncToken: string) {
    const { data: { items: calendars, nextSyncToken } } = await this.calendarApi.calendarList.list();

    await this.updateCalendarListSyncToken(nextSyncToken);

    for await (const calendar of calendars) {
      if (calendar.deleted) {
        await this.deleteCalendar(calendar.id);
      } else {
        await this.updateOrCreateCalendar(calendar);
        await this.eventSyncHandler(calendar.id);
      }
    }
  }

  private async getCalendarListSyncToken() {
    try {
      const syncToken = await this.prisma.calendarSync.findUnique({
        where: { id: 0 },
      });
      if (syncToken === null) {
        return undefined;
      }
      return syncToken.syncToken.toString();
    } catch (error) {
      throw PrismaErrorHandler(error)
    }
  }

  private async updateCalendarListSyncToken(nextSyncToken: string) {
    try {
      const updatedSyncToken = await this.prisma.calendarSync.upsert({
        where: { id: 0 },
        update: { syncToken: nextSyncToken },
        create: { syncToken: nextSyncToken }
      });

      return updatedSyncToken;
    } catch (error) {
      throw PrismaErrorHandler(error);
    }
  }

  private async deleteCalendar(calendarId: string) {
    try {
      const deleted = await this.prisma.meetingRoom.delete({ where: { room_id: calendarId } });

      return deleted;
    } catch (error) {
      throw PrismaErrorHandler(error);
    }
  }

  private async updateOrCreateCalendar(calendar: calendar_v3.Schema$Calendar) {
    try {
      const newCalendar = await this.prisma.meetingRoom.upsert({
        where: { room_id: calendar.id },
        update: {
          name: calendar.summary,
        },
        create: {
          room_id: calendar.id,
          name: calendar.summary
        }
      });
    } catch (error) {
      throw PrismaErrorHandler(error);
    }
  }

  //-----EVENTS-----\\
  async syncEventsOfAllCalendar() {
    try {
      const calendars = await this.prisma.meetingRoom.findMany();

      if (!calendars) {
        throw new Error('No calendars found!')
      }

      for await (const calendar of calendars) {
        await this.eventSyncHandler(calendar.room_id);
      }
    } catch (error) {
      throw new Error(`Failed to synchronize all calendars: ${error}`);
    }
  }

  async eventSyncHandler(calendarId: string) {
    try {
      let syncToken = await this.getEventSyncToken(calendarId);

      if (!syncToken) {
        await this.fullEventSync(calendarId);
        console.log("Full envent sync")
      } else {
        await this.incrementalEventSync(calendarId, syncToken);
        console.log("incremental even sync")
      }

    } catch (error) {
      if (error.message.includes('Sync token is no longer valid')) {
        await this.fullEventSync(calendarId);
      } else {
        throw new Error(`Failed to synchronize events:${error}`);
      }
    }
  }

  private async getEventSyncToken(calendarId: string) {
    try {
      const syncToken = await this.prisma.meetingRoom.findUnique({
        where: { room_id: calendarId },
        select: { syncToken: true }
      });

      if (syncToken === null || syncToken.syncToken === null) {
        return undefined;
      }

      return syncToken.syncToken.toString();

    } catch (error) {
      throw PrismaErrorHandler(error);
    }
  }

  private async fullEventSync(calendarId: string) {
    const { data: { items: events, nextSyncToken } } = await this.calendarApi.events.list({ calendarId });

    await this.updateEventSyncToken(calendarId, nextSyncToken);

    for await (const event of events) {
      await this.updateOrCreateEvent(calendarId, event);
    }
  }

  private async incrementalEventSync(calendarId: string, syncToken: string) {
    const { data: { items: events, nextSyncToken } } = await this.calendarApi.events.list({
      calendarId,
      syncToken
    });

    await this.updateEventSyncToken(calendarId, nextSyncToken);

    if (!events) {
      console.log("Already up to date!")
      return "Already up to date!";
    }

    for await (const event of events) {
      console.log(event.status)
      if (event.status == 'cancelled') {
        await this.deleteEvent(event.id);
      } else {
        await this.updateOrCreateEvent(calendarId, event);
      }
    }
  }

  private async deleteEvent(eventId: string) {
    try {
      const deleted = await this.prisma.reservation.delete({ where: { res_id: eventId } });

      console.log(deleted)
      return deleted;
    } catch (error) {
      throw PrismaErrorHandler(error);
    }
  }

  private async updateOrCreateEvent(calendarId: string, event: calendar_v3.Schema$Event) {
    try {
      const newEvent = await this.prisma.reservation.upsert({
        where: { res_id: event.id },
        update: {
          res_name: event?.summary,
          description: event?.description,
          date_start: event?.start.dateTime,
          date_end: event?.end.dateTime,
          arranger: {
            connectOrCreate: {
              where: { user_email: event.organizer.email },
              create: {
                user_email: event.organizer.email,
                role: { connect: { role_name: "guest" } }
              },
            }
          },
          users: {
            connect: event.attendees?.map(attendee => ({ user_email: attendee.email }))
          }
        },
        create: {
          res_id: event.id,
          res_name: event.summary,
          description: event.description,
          room: { connect: { room_id: calendarId } },
          date_start: event.start.dateTime,
          date_end: event.end.dateTime,
          arranger: {
            connectOrCreate: {
              where: { user_email: event.organizer.email },
              create: {
                user_email: event.organizer.email,
                role: { connect: { role_name: "guest" } }
              },
            }
          },
        },
      });
      console.log(newEvent)
      newEvent;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(error)
      }
      console.log(error)
    }
  }

  private async updateEventSyncToken(calendarId: string, syncToken: string) {
    const updated = await this.prisma.meetingRoom.update({
      where: { room_id: calendarId },
      data: { syncToken }
    })
  }

  private async createGoogleEvent(
    calendarId: string,
    startDate: Date,
    endDate: Date,
    name: string,
    timeZone: string,
    description?: string,
    organizer?: calendar_v3.Schema$EventAttendee,
    attendees?: string[]): Promise<calendar_v3.Schema$Event> {

    const googleAttendees = this.createAttendees(attendees);

    const newEvent: calendar_v3.Schema$Event = {
      summary: name,
      description,
      start: this.convertDate(startDate, timeZone),
      end: this.convertDate(endDate, timeZone),
      organizer,
      attendees: [
        ...googleAttendees,
        {
          email: calendarId,
          resource: true
        }
      ],
    };

    return newEvent;

  }

  async uploadGoogleEvent(
    calendarId: string,
    startDate: Date,
    endDate: Date,
    name: string,
    timeZone: string,
    description?: string,
    organizer?: string,
    attendee?: string[]) {
    try {
      const newOrganizer = await this.convertOrganizer(organizer);
      const newEvent = await this.createGoogleEvent(
        calendarId,
        startDate,
        endDate,
        name,
        timeZone,
        description,
        newOrganizer,
        attendee
      );
      const response = await this.calendarApi.events.insert({
        calendarId,
        requestBody: newEvent,
      });

      await this.eventSyncHandler(calendarId);
    } catch (error) {
      throw new Error(`Failed to insert new event: ${error}`);
    }
  }

  private createAttendees(attendees: string[]): calendar_v3.Schema$EventAttendee[] {
    let eventAttendees: calendar_v3.Schema$EventAttendee[] = [];
    if (attendees) {
      attendees.forEach(attendee => {
        eventAttendees.push({ email: attendee })
      });

      return eventAttendees;
    }

    return [];
  }

  private convertDate(date: Date, timeZone: string): calendar_v3.Schema$EventDateTime {
    const newDate = new Date(date);
    return {
      dateTime: newDate.toISOString(),
      timeZone,
    }
  }

  private async getCalendarIdByEventId(eventId: string): Promise<string> {
    const reservation = await this.prisma.reservation.findUnique({
      where: { res_id: eventId },
      select: { room_id: true },
    });
    return reservation.room_id.toString();
  }

  async deleteGoogleEvent(eventId: string) {
    try {
      const calendarId: string = await this.getCalendarIdByEventId(eventId);

      await this.calendarApi.events.delete({
        eventId,
        calendarId,
      });

      this.eventSyncHandler(calendarId);

    } catch (error) {
      throw new Error(`Failed to delete event: ${error}`);
    }
  }

  async updateGoogleEvent(
    calendarId: string,
    eventId: string,
    startDate?: Date,
    endDate?: Date,
    name?: string,
    timeZone?: string,
    description?: string,
    organizer?: string,
    attendees?: string[]
  ) {
    try {
      const newOrganizer: calendar_v3.Schema$EventAttendee = await this.convertOrganizer(organizer);
      const updatedEvent: calendar_v3.Schema$Event = await this.createGoogleEvent(
        calendarId,
        startDate,
        endDate,
        name,
        timeZone,
        description,
        newOrganizer,
        attendees
      );

      const response = await this.calendarApi.events.update({
        calendarId,
        eventId,
        requestBody: updatedEvent
      });

      await this.eventSyncHandler(calendarId);
    } catch (error) {
      throw new Error(`Failed to update the event: ${error}`);
    }
  }

  private async convertOrganizer(organizer: string): Promise<calendar_v3.Schema$EventAttendee> {
    const googleOrganizer: calendar_v3.Schema$EventAttendee = {
      email: organizer,
    }

    return googleOrganizer;
  }
}
