import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { config } from '../../config'

export type JwtPayload = {
    email: string;
    role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private readonly prisma: PrismaService
    ) {
        const extractJwtFromCookie = (req) => {
            let token = null;
            if (req && req.cookies) {
                token = req.cookies['access_token'];
            }
            return token || ExtractJwt.fromAuthHeaderAsBearerToken();
        };

        super({
            ignoreExpiration: false,
            secretOrKey: config.jwtSecret,
            jwtFromRequest: extractJwtFromCookie,
        });
    }

    async validate(payload: JwtPayload) {
        console.log(payload + "|||||||||||||||")
        const user = await this.prisma.user.findUnique({ where: { user_email: payload.email } });

        if (!user) throw new UnauthorizedException('Please log in to continue!');

        return {
            email: payload.email,
            role: payload.role
        }
    }
}