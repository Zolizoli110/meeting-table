import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    await prisma.reservation.deleteMany();
    await prisma.meetingRoom.deleteMany();
    await prisma.guest.deleteMany();

    const rooms = await prisma.meetingRoom.createMany({
        data: [
            {
                name: 'Vonat tárgyaló',

            },
            {
                name: 'Troli tárgyaló'
            }
        ]
    });
    const guests = await prisma.guest.createMany({
        data: [
            {
                guest_email: 'daniel.furedi03@gmail.com',
            },
            {
                guest_email: 'zolika.suveges@gmail.com'
            },
            {
                guest_email: 'arpas.peter@gmail.com'
            }
        ]
    });
    const reservations = await prisma.reservation.create({
        data:
        {
            res_name: 'daily standup - team 1',
            room: { connect: { name: 'Vonat tárgyaló' } },
            date_start: new Date(),
            date_end: new Date(),
            description: 'szokásos daily',
            guests: { connect: [{ guest_email: 'daniel.furedi03@gmail.com' }, { guest_email: 'zolika.suveges@gmail.com' }, { guest_email: 'arpas.peter@gmail.com' }] },
            arranger: { connect: { guest_email: 'daniel.furedi03@gmail.com' } }
        },
    }
    )
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