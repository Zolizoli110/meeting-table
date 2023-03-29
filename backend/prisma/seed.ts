import { PrismaClient } from "@prisma/client";
import { add } from "date-fns";

const prisma = new PrismaClient();

async function main() {
    await prisma.reservation.deleteMany();
    await prisma.meetingRoom.deleteMany();
    await prisma.user.deleteMany();
    await prisma.role.deleteMany();

    const roles = await prisma.role.createMany({
        data: [
            {
                role_name: 'admin'
            },
            {
                role_name: 'guest'
            },
            {
                role_name: 'worker'
            }
        ]
    });
    const rooms = await prisma.meetingRoom.createMany({
        data: [
            {
                name: 'Vonat tárgyaló',

            },
            {
                name: 'Troli tárgyaló',

            }
        ]
    });
    const guests = await prisma.user.createMany({
        data: [
            {
                user_email: 'daniel.furedi03@gmail.com',
                role_name: 'admin'
            },
            {
                user_email: 'zolika.suveges@gmail.com',
                role_name: 'worker'
            },
            {
                user_email: 'arpas.peter@gmail.com',
                role_name: 'guest'
            }
        ]
    });
    const reservation1 = await prisma.reservation.create({
        data:
        {
            res_name: 'daily standup - team 1',
            room: { connect: { name: 'Vonat tárgyaló' } },
            date_start: new Date(),
            date_end: add(new Date, { hours: 1 }),
            description: 'szokásos daily',
            users: { connect: [{ user_email: 'daniel.furedi03@gmail.com' }, { user_email: 'zolika.suveges@gmail.com' }, { user_email: 'arpas.peter@gmail.com' }] },
            arranger: { connect: { user_email: 'daniel.furedi03@gmail.com' } }
        },
    })
    const reservation2 = await prisma.reservation.create({
        data:
        {
            res_name: 'sprintzáró',
            room: { connect: { name: 'Vonat tárgyaló' } },
            date_start: add(new Date, { minutes: 15 }),
            date_end: add(new Date, { hours: 1 }),
            description: 'szokásos daily',
            users: { connect: [{ user_email: 'daniel.furedi03@gmail.com' }, { user_email: 'zolika.suveges@gmail.com' }, { user_email: 'arpas.peter@gmail.com' }] },
            arranger: { connect: { user_email: 'daniel.furedi03@gmail.com' } }
        },
    })
};
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    });