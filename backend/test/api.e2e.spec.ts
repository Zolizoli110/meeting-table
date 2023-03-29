import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { MeetingroomModule } from '../src/meeting_room/meeting_room.module';
import CreateMeetingRoomDto from 'src/meeting_room/dto/create-meetingroom.dto';
import { arrayContains } from 'class-validator';
import { ApiModule } from '../src/api/api.module';

describe('API Controller e2e test', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.
            createTestingModule({
                imports: [ApiModule],
            }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
    });

    describe('/subscribe POST // subscribing a client', () => {

        it('should subscribe a client', () => {
            return request(app.getHttpServer())
                .post('/api/subscribe')
                .send({
                    room_id: 1,
                    callbackIp: '192.168.10.10'
                })
                .expect(201);
        });

        it('should return a 400 when invalid name is passed', () => {
            return request(app.getHttpServer())
                .post('/meetingroom')
                .send({
                    room_id: 0,
                    callbackIp: '192.168.10.10'
                })
                .expect(400);
        });
    })
})