import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const room1 = await prisma.meetingRoom.upsert({
        where: { room_id: 1 },
        update: {},
        create: {
            name: 'Vonat tárgyaló',
        }
    });
    const room2 = await prisma.meetingRoom.upsert({
        where: { room_id: 2 },
        update: {},
        create: {
            name: 'Troli tárgyaló',
        }
    });
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    });