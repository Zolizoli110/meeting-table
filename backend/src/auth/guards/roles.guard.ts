import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../roles.decorator';
import { ExtractJwt } from "passport-jwt";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRole: String = this.reflector.getAllAndOverride<String>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRole) {
            return true;
        }
        const actualRole: string = context.switchToHttp().getRequest().user
        // const { user } = context.switchToHttp().getRequest().headers;
        // const userObj = JSON.parse(user);
        // console.log(context.switchToHttp().getRequest())
        // const acutalRole: string = ExtractJwt.fromAuthHeaderAsBearerToken(context.switchToHttp().getRequest().headers);
        // console.log(actualRole)

        return actualRole === requiredRole;
    }
}