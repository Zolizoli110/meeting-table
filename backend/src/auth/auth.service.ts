import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { Logger } from 'concurrently';
import { CreateGuestDto } from 'src/guest/dto/create-guest.dto';
import PrismaErrorHandler from 'src/prisma-errors';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private readonly prisma: PrismaService
    ) { }

    generateJwt(payload) {
        return this.jwtService.sign(payload);
    }

    async singIn(user) {

        if (!user) {
            throw new BadRequestException('Unauthenticated');
        }

        const existingUser = await this.prisma.user.findUnique({
            where: { user_email: user.email }
        });

        if (!existingUser) {
            return this.registerUser({ user_email: user.email, role_name: 'guest' });
        }

        return this.generateJwt({
            email: existingUser.user_email,
            role: existingUser.role_name
        })
    }

    async registerUser(user: CreateGuestDto) {
        try {
            const newUser = await this.prisma.user.create({
                data: {
                    user_email: user.user_email,
                    role: {
                        connect: { role_name: 'guest' }
                    }
                }
            });

            return this.generateJwt({
                email: newUser.user_email,
                role: newUser.role_name
            });
        } catch (error) {
            throw PrismaErrorHandler(error);
        }
    }
}
