import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, RequestMethod, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { MeetingroomModule } from '../src/meeting_room/meeting_room.module';
import CreateMeetingRoomDto from 'src/meeting_room/dto/create-meetingroom.dto';
import { arrayContains } from 'class-validator';

describe('Meeting Room Controller e2e test', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.
            createTestingModule({
                imports: [MeetingroomModule],
            }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
    });

    const validMeetingRoom = {
        name: "Hév tárgyaló"
    }
    const updatedValidMeetingRoom = {
        name: "Repülő tárgyaló"
    }
    const invalidMeetingRoom = {
        name: 12
    }
    const updatedInvalidMeetingRoom = {
        name: 13
    }
    let createdMeetingRoom;

    describe('/meetingroom POST // creating meeting rooms', () => {

        it('should create a meeting room', () => {
            return request(app.getHttpServer())
                .post('/meetingroom')
                .send(validMeetingRoom)
                .expect(201)
                .then(response => {
                    createdMeetingRoom = response.body;
                    expect(createdMeetingRoom.name).toEqual(validMeetingRoom.name);
                });
        });

        it('should return a 400 when invalid name is passed', () => {
            return request(app.getHttpServer())
                .post('/meetingroom')
                .send(invalidMeetingRoom)
                .expect(400);
        });
    })

    describe('/meetingroom GET // get all meeting rooms', () => {
        it('should return all meeting rooms', () => {
            return request(app.getHttpServer())
                .get('/meetingroom')
                .expect(200)
                .expect(res => {
                    expect(res.body).toEqual(expect.arrayContaining([createdMeetingRoom]))
                })
        });
    })

    describe('/meetingroom/id // get one meeting room by id', () => {
        it('should return the meeting room with given id', () => {
            return request(app.getHttpServer())
                .get(`/meetingroom/${createdMeetingRoom.room_id}`)
                .expect(200)
                .then(response => {
                    expect(response.body.name).toEqual(validMeetingRoom.name);
                });
        });

        it('should give 404 not found', () => {
            return request(app.getHttpServer())
                .get('/meetingroom/0')
                .expect(404)
        })
    })

    describe('UPDATE /meetingroom/id // updates given meeting room', () => {
        it('should update specified meeting room', () => {
            return request(app.getHttpServer())
                .patch(`/meetingroom/${createdMeetingRoom.room_id}`)
                .send(updatedValidMeetingRoom)
                .expect(200)
                .then(response => {
                    expect(response.body.name).toEqual(updatedValidMeetingRoom.name)
                });
        })

        it('should give 400 bad request', () => {
            return request(app.getHttpServer())
                .patch('/meetingroom/1')
                .send(updatedInvalidMeetingRoom)
                .expect(400);
        })

        it('should give a 404 not found', () => {
            return request(app.getHttpServer())
                .patch('/meetingroom/0')
                .expect(404);
        })
    })

    describe('DELETE /meetingroom/id // deletes given meeting room', () => {
        it('should delete specified meeting room', () => {
            return request(app.getHttpServer())
                .delete(`/meetingroom/${createdMeetingRoom.room_id}`)
                .expect(200)
                .then(() => {
                    return request(app.getHttpServer())
                        .get(`/meetingroom/${createdMeetingRoom.room_id}`)
                        .expect(404)
                });
        })

        it('should give a 404 not found', () => {
            return request(app.getHttpServer())
                .delete('/meetingroom/0')
                .expect(404);
        })

        it('lmao', () => {
            return request(app.getHttpServer())
                .get('/meetingroom')
                .expect(200)
                .then(res => {
                    expect(res.body).not.toContain([createdMeetingRoom])
                });
        })
    })
})