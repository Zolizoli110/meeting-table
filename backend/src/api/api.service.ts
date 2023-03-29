import { Injectable } from '@nestjs/common';
import { connect } from 'http2';
import PrismaErrorHandler from '../prisma-errors';
import { PrismaService } from '../prisma/prisma.service';
import { subscribeDto } from './dto/subscribeDto';

@Injectable()
export class ApiService {
    constructor(private readonly prisma: PrismaService) { }

    async subscribeClient(body: subscribeDto) {
        try {
            const exists = await this.prisma.client.findUnique({
                where: { callback_ip: body.callbackIp }
            });
            if (exists) {
                const deleted = await this.prisma.client.delete({
                    where: { callback_ip: body.callbackIp }
                });
            }
            const subscriber = await this.prisma.client.upsert({
                where: { meetingroom_id: body.room_id },
                update: { callback_ip: body.callbackIp },
                create: {
                    meetingroom: { connect: { room_id: body.room_id } },
                    callback_ip: body.callbackIp
                }
            });
            return subscriber;
        } catch (error) {
            throw PrismaErrorHandler(error)
        }
    }
}
