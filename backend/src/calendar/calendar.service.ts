import { HttpCode, Injectable } from '@nestjs/common';
import PrismaErrorHandler from 'src/prisma-errors';
import { PrismaService } from 'src/prisma/prisma.service';
import { google, calendar_v3 } from 'googleapis';
import { config } from '../config'
import { Prisma } from '@prisma/client';

@Injectable()
export class CalendarService {
  private calendarApi: calendar_v3.Calendar;
  constructor(private readonly prisma: PrismaService) {
    this.initializeGoogleAuth().then((client) => {
      this.calendarApi = google.calendar({ version: 'v3' })
    });
  }

  //-----SERVICE_ACCOUNT-----\\

  private async initializeGoogleAuth() {
    const auth = new google.auth.GoogleAuth({
      keyFile: config.serviceAccountAuth,
      scopes: ["https://www.googleapis.com/auth/calendar"],
    });

    const client = await auth.getClient();
    google.options({ auth: client });
    return client;
  }

  async subscribeToCalendar(calendarId: string) {
    await this.calendarApi.calendarList.insert({
      requestBody: { id: calendarId }
    });
    this.calendarListSyncHandler();
  }

  async unsubscribeFromCalendar(calendarId: string) {
    await this.calendarApi.calendarList.delete({ calendarId });
    this.calendarListSyncHandler();
  }


  //-----CALENDAR_LIST-----\\

  async calendarListSyncHandler() {
    try {
      let syncToken = await this.getCalendarListSyncToken();

      if (!syncToken) {
        await this.fullCalendarListSync();
      } else {
        await this.incrementalCalendarListSync(syncToken);
      }
    } catch (error) {
      if (error.message.includes('Sync token is no longer valid')) {
        await this.fullCalendarListSync();
      } else {
        throw new Error(error)
      }
    }
  }

  private async fullCalendarListSync() {
    const { data: { items: calendars, nextSyncToken } } = await this.calendarApi.calendarList.list();

    this.updateCalendarListSyncToken(nextSyncToken);

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
      throw new Error(error)
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
      throw PrismaErrorHandler(error)
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

      return newCalendar;
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
      } else {
        await this.incrementalEventSync(calendarId, syncToken);
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
      if (!event.recurrence) {
        await this.updateOrCreateEvent(calendarId, event);
      } else {
        const { data: { items: instances, nextSyncToken } } = await this.calendarApi.events.instances({
          calendarId,
          eventId: event.id
        });

        await this.updateEventSyncToken(calendarId, nextSyncToken);

        for await (const instance of instances) {
          await this.updateOrCreateEvent(calendarId, instance);
        }
      }
    }
  }

  private async incrementalEventSync(calendarId: string, syncToken: string) {
    const { data: { items: events, nextSyncToken } } = await this.calendarApi.events.list({
      calendarId,
      syncToken
    });

    await this.updateEventSyncToken(calendarId, nextSyncToken);

    if (!events) {
      return "Already up to date";
    }

    for await (const event of events) {
      if (!event.recurrence) {
        if (event.status == 'cancelled') {
          await this.deleteEvent(event.id);
        } else {
          await this.updateOrCreateEvent(calendarId, event);
        }
      } else {
        const { data: { items: instances, nextSyncToken } } = await this.calendarApi.events.instances({
          calendarId,
          eventId: event.id
        });

        this.updateEventSyncToken(calendarId, nextSyncToken);


        for await (const instance of instances) {
          if (instance.status == 'cancelled') {
            await this.deleteEvent(instance.id);
          } else {
            await this.updateOrCreateEvent(calendarId, instance);
          }
        }
      }
    }
  }

  private async deleteEvent(eventId: string) {
    try {
      const deleted = await this.prisma.reservation.delete({ where: { res_id: eventId } });

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
      return newEvent;
    } catch (error) {
      throw new Error(`Failed to create event: ${error}`);
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
    attendees?: string[],
    recurrence?: string[]
  ): Promise<calendar_v3.Schema$Event> {

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
      recurrence
    };

    return newEvent;

  }

  private buildRecurrenceRule(
    frequency?: string,
    interval?: number,
    count?: number,
    until?: Date,
    byDay?: string[],
    byMonth?: number[],
    byMonthDay?: number[],
  ) {
    const ruleObj = {
      FREQ: frequency ? frequency.toUpperCase() : '',
      INTERVAL: interval > 0 ? interval : '',
      COUNT: count > 0 ? count : '',
      UNTIL: until ? until.toISOString().replace(/[-:.]/g, '').split('T')[0] : '',
      BYDAY: byDay.length > 0 ? byDay.join(',') : '',
      BYMONTHDAY: byMonthDay.length > 0 ? byMonthDay.join(',') : '',
      BYMONTH: byMonth.length > 0 ? byMonth.join(',') : ''
    };

    const recurranceRule = Object.entries(ruleObj)
      .filter(([_, value]) => value)
      .map(([key, value]) => `${key}=${value}`)
      .join(';');

    return recurranceRule ? [`RRULE:${recurranceRule}`] : [];
  }

  private makeRecurranceRules(
    RRULE_frequency?: string,
    RRULE_until?: Date,
    RRULE_count?: number,
    RRULE_interval?: number,
    RRULE_byDay?: string[],
    RRULE_byMonth?: number[],
    RRULE_byMonthDay?: number[],
    EXRULE_frequency?: string,
    EXRULE_count?: number,
    EXRULE_until?: Date,
    EXRULE_interval?: number,
    EXRULE_byDay?: string[],
    EXRULE_byMonth?: number[],
    EXRULE_byMonthDay?: number[],
    RDATE_date?: Date[],
    EXDATE_date?: Date[]
  ): string[] | undefined {
    const rrule = this.buildRecurrenceRule(
      RRULE_frequency,
      RRULE_interval,
      RRULE_count,
      RRULE_until,
      RRULE_byDay,
      RRULE_byMonthDay,
      RRULE_byMonth
    );

    const exrule = this.buildRecurrenceRule(
      EXRULE_frequency,
      EXRULE_interval,
      EXRULE_count,
      EXRULE_until,
      EXRULE_byDay,
      EXRULE_byMonthDay,
      EXRULE_byMonth,
    );

    const rdate = RDATE_date
      ? RDATE_date.map((date) => `RDATE;VALUE=DATE:${date.toISOString().split('T')[0].replace(/-/g, '')}`)
      : [];

    const exdate = EXDATE_date.map((date) => `EXDATE;VALUE=DATE:${date.toISOString().split('T')[0].replace(/-/g, '')}`)

    let rules = undefined;

    rules = [...rrule, ...exrule, ...rdate, exdate];

    return rules ? rules : undefined;
  }

  async uploadGoogleEvent(
    calendarId: string,
    startDate: Date,
    endDate: Date,
    name: string,
    timeZone: string,
    description?: string,
    organizer?: string,
    attendee?: string[],
    RRULE_frequency?: string, //HOURLY,DAILY,WEEKLY,MONTHLY,YEARLY
    RRULE_until?: Date,
    RRULE_count?: number,
    RRULE_interval?: number,
    RRULE_byDay?: string[], //MO,TU,WE,TH,FR,SA,SU //first, second, second-to-last, last of the month 1,2,-2,-1 //syntax: 1WE
    RRULE_byMonth?: number[], // 1-12
    RRULE_byMonthDay?: number[], // 1-31
    EXRULE_frequency?: string,
    EXRULE_count?: number,
    EXRULE_until?: Date,
    EXRULE_interval?: number,
    EXRULE_byDay?: string[],
    EXRULE_byMonth?: number[],
    EXRULE_byMonthDay?: number[],
    RDATE_date?: Date[],
    EXDATE_date?: Date[]
  ) {
    try {
      const rrule = this.makeRecurranceRules(
        RRULE_frequency,
        RRULE_until,
        RRULE_count,
        RRULE_interval,
        RRULE_byDay,
        RRULE_byMonth,
        RRULE_byMonthDay,
        EXRULE_frequency,
        EXRULE_count,
        EXRULE_until,
        EXRULE_interval,
        EXRULE_byDay,
        EXRULE_byMonth,
        EXRULE_byMonthDay,
        RDATE_date,
        EXDATE_date
      );
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
