import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ApiService {
    constructor(private readonly prisma: PrismaService) { }
    private clients: Array<{ client_id: number, response: Response, roomId: number }> = [];

    async handleClients(response: Response, client_id: number, roomId: number) {
        // adds the client and it's connection to in-memory storage
        this.clients.push({ client_id, response, roomId });

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
