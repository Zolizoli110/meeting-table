import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { config } from "src/config";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(private readonly prisma: PrismaService) {
        super({
            clientID: config.clientId,
            clientSecret: config.clientSecret,
            callbackURL: config.callbackUrl,
            scope: ['email', 'profile', 'https://www.googleapis.com/auth/calendar']
        });
    }
    
    async validate (
        accesToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ): Promise<any> {
        const { id, name, emails, photos } = profile;

        const user = {
            provider: 'google',
            providerId: id,
            email: emails[0].value,
            name: `${name.giveName} ${name.familyName}`,
            picture: photos[0].value,
        };

        done(null, user);
    }
}