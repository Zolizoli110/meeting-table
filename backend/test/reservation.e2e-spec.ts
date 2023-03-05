import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { ReservationModule } from './../src/reservation/reservation.module';

describe('Reservation Controller E2E Test', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.
      createTestingModule({
        imports: [ReservationModule],
      }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  const reservation = {
    resName: "sprint end",
    roomId: 1,
    dateStart: "2023-02-16T19:45:00.000Z",
    dateEnd: "2023-02-16T19:50:00.000Z",
    description: "villamos sprint",
    arrangerEmail: "zolika.suveges@gmail.com",
    guestEmails: [
      "zolika.suveges@gmail.com",
      "daniel.furedi03@gmail.com"
    ]
  };
  const changedReservation = {
    resName: "patch",
    roomName: "Troli tárgyaló",
    dateStart: "2023-02-16T10:45:00.000Z",
    dateEnd: "2023-02-16T10:50:00.000Z",
    description: "patch test",
    guests: [
      "zolika.suveges@gmail.com",
      "daniel.furedi03@gmail.com",
      "arpas.peter@gmail.com"
    ]
  }
  let createdReservationBody: any;

  it('/reservation (POST)', () => {
    return request(app.getHttpServer())
      .post('/reservation')
      .send(reservation)
      .expect(201)
      .then(response => {
        createdReservationBody = response.body;
        expect(createdReservationBody);
      });
  });

  it('/reservation (POST)', () => {
    return request(app.getHttpServer())
      .post('/reservation')
      .send(reservation)
      .expect(409)
  });


  it('/reservation (GET)', () => {
    return request(app.getHttpServer())
      .get('/reservation')
      .expect(200)
      .then(response => {
        expect(response.body).toEqual(expect.arrayContaining([createdReservationBody]));
      });
  });

  it('/reservation/:id (GET)', () => {
    return request(app.getHttpServer())
      .get(`/reservation/${createdReservationBody.res_id}`)
      .expect(200);
  });

  it('/reservation (PATCH)', () => {
    return request(app.getHttpServer())
      .patch(`/reservation/${createdReservationBody.res_id}`)
      .send(changedReservation)
      .expect(200);
  });

  it('/reservation (DELETE)', () => {
    return request(app.getHttpServer())
      .delete(`/reservation/${createdReservationBody.res_id}`)
      .expect(200);
  });

  it('/reservation (DELETE)', () => {
    return request(app.getHttpServer())
      .delete(`/reservation/${createdReservationBody.res_id}`)
      .expect(404);
  });

  it('should return 404', () => {
    return request(app.getHttpServer())
      .get(`/reservation/${createdReservationBody.res_id}`)
      .expect(404);
  });

  it('should not contain the created reservation', () => {
    return request(app.getHttpServer())
      .get(`/reservation`)
      .expect(200)
      .then(response => {
        expect(response.body).toEqual(expect.not.arrayContaining([createdReservationBody]));
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
