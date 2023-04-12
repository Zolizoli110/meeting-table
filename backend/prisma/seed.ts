import { PrismaClient } from "@prisma/client";
import { Prisma } from "@prisma/client"

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
