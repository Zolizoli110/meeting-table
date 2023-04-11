import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { connect } from 'http2';
import PrismaErrorHandler from '../prisma-errors';
import { PrismaService } from '../prisma/prisma.service';
import { subscribeDto } from './dto/subscribeDto';

@Injectable()
export class ApiService {
    constructor(private readonly prisma: PrismaService) { }
    private clients: Array<{ client_id: number, response: Response, roomId: number }> = [];

    async handleClients(response: Response, client_id: number, roomId: number) {
        // adds the client and it's connection to in-memory storage
        this.clients.push({ client_id, response, roomId });
        console.log(this.clients.map(({ client_id, roomId }) => ({ client_id, roomId })));

        // when a tablet disconnects from the NFC docker
        response.on('close', async () => {
            this.clients = this.clients.filter(client => client.client_id !== client_id);
        })
    }

    sendEventToAll(event: string, data: string | object) {
        this.clients.forEach(client => {
            client.response.write(`event: ${event}\n`);
            client.response.write(`data: ${data}\n`);
        })
    }

    sendEvent(roomId: number, event: string, data: string | object) {
        const client = this.clients.find(client => client.roomId === roomId);
        client.response.write(`event: ${event}\n`);
        client.response.write(`data: ${data}\n`);
    }
}
