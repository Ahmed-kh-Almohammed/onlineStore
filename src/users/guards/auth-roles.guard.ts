import { BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { CURRENT_USER_KEY } from "src/utils/constants";
import { UserType } from "src/utils/enums";
import { JWTPayloadType } from "src/utils/types";
import { UsersService } from "../users.service";

@Injectable()
export class AuthRolesGuard implements CanActivate {

    constructor(private readonly jwtservice: JwtService,
        private readonly config: ConfigService,
        private readonly reflector: Reflector,
        private readonly userservice: UsersService
    ) { }
    async canActivate(context: ExecutionContext) {

        const roles: UserType[] = this.reflector.getAllAndOverride('roles',
            [context.getHandler(), context.getClass()])
        if (!roles || roles.length === 0) return false;

        const request: Request = context.switchToHttp().getRequest();
        const [type, token] = request.headers.authorization.split(" ") ?? [];
        if (type === "Bearer" && token) {
            try {
                const payload: JWTPayloadType = await this.jwtservice.verifyAsync(token, {
                    secret: this.config.get<string>("JWT_SECRET")
                });
                const user = await this.userservice.getCurrentUser(payload.id);
                if (!user) return false;
                if (roles.includes(user.userType)) {
                    request[CURRENT_USER_KEY] = payload;
                    return true;
                }
            } catch (error) {
                throw new UnauthorizedException("invalid token  ")
            }
        }
        else {
            throw new UnauthorizedException("no token provided  ")
        }
        return false;

    }

}