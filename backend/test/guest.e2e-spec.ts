import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { GuestModule } from './../src/guest/guest.module';

describe('Guest Controller e2e test', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.
            createTestingModule({
                imports: [GuestModule],
            }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
    });

    const validGuest = {
        guest_email: "example@gmail.com",
    }
    const updatedValidGuest = {
        guest_email: "example@gmail.com",
    }
    const invalidGuest = {
        guest_email: 12
    }
    const updatedInvalidGuest = {
        guest_email: 13
    }
    let createdGuest;

    describe('/guest POST // creating a guest', () => {

        it('should create a guest', () => {
            return request(app.getHttpServer())
                .post('/guest')
                .send(validGuest)
                .expect(201)
                .then(response => {
                    createdGuest = response.body;
                    expect(createdGuest.guest_email).toEqual(validGuest.guest_email);
                });
        });

        it('should return a 400 when invalid email is passed', () => {
            return request(app.getHttpServer())
                .post('/guest')
                .send(invalidGuest)
                .expect(400);
        });
    })

    describe('/guest GET // get all guests', () => {
        it('should return all guests', () => {
            return request(app.getHttpServer())
                .get('/guest')
                .expect(200)
                .expect(res => {
                    expect(res.body).toEqual(expect.arrayContaining([createdGuest]))
                })
        });
    })

    describe('/guest/:email // get one guest by id', () => {
        it('should return the guest with given id', () => {
            return request(app.getHttpServer())
                .get(`/guest/${createdGuest.guest_email}`)
                .expect(200)
                .then(response => {
                    expect(response.body.guest_email).toEqual(validGuest.guest_email);
                });
        });

        it('should give 404 not found', () => {
            return request(app.getHttpServer())
                .get('/guest/0')
                .expect(404)
        })
    })

    describe('UPDATE /guest/email // updates given guest', () => {
        it('should update specified guest', () => {
            return request(app.getHttpServer())
                .patch(`/guest/${createdGuest.guest_email}`)
                .send(updatedValidGuest)
                .expect(200)
                .then(response => {
                    expect(response.body.guest_email).toEqual(updatedValidGuest.guest_email)
                });
        })

        it('should give 400 bad request', () => {
            return request(app.getHttpServer())
                .patch(`/guest/${createdGuest.guest_email}`)
                .send(updatedInvalidGuest)
                .expect(400);
        })

        it('should give a 404 not found', () => {
            return request(app.getHttpServer())
                .patch('/guest/0')
                .expect(404);
        })
    })

    describe('DELETE /guest/:email // deletes given guest', () => {
        it('should delete specified guest', () => {
            return request(app.getHttpServer())
                .delete(`/guest/${createdGuest.guest_email}`)
                .expect(200)
                .then(() => {
                    return request(app.getHttpServer())
                        .get(`/guest/${createdGuest.guest_email}`)
                        .expect(404)
                });
        })

        it('should give a 404 not found', () => {
            return request(app.getHttpServer())
                .delete('/guest/0')
                .expect(404);
        })

        it('should not contain the deleted guest', () => {
            return request(app.getHttpServer())
                .get('/guest')
                .expect(200)
                .then(res => {
                    expect(res.body).not.toContain([createdGuest])
                });
        })
    })
})