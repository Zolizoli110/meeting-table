import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'
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
    ) {}
    generateJwt(payload) {
        return this.jwtService.sign(payload);
    }

    async singIn(user) {
        console.log(user);

        if (!user) {
            throw new BadRequestException('Unauthenticated');
        }

        const userExists = await this.prisma.guest.findUnique({
            where: {guest_email: user.email}
        });

        if(!userExists) {
            return this.registerUser({guest_email: user.email});
        }

        return this.generateJwt({
            email: userExists.guest_email,
        })
    }

    async registerUser(user: CreateGuestDto) {
        try {
            const newUser = await this.prisma.guest.create({
                data: {guest_email: user.guest_email}
            });

            return this.generateJwt({
                email: newUser.guest_email
            });
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError){
                console.log()
            }
            throw PrismaErrorHandler(error);
        }
    }
}
