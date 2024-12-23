import { BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { CURRENT_USER_KEY } from "src/utils/constants";
import { JWTPayloadType } from "src/utils/types";
@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private readonly jwtservice: JwtService,
        private readonly config: ConfigService
    ) { }
    async canActivate(context: ExecutionContext) {


        const request: Request = context.switchToHttp().getRequest();
        const [type, token] = request.headers.authorization.split(" ") ?? [];
        if (type === "Bearer" && token) {
            try {
                const payload: JWTPayloadType = await this.jwtservice.verifyAsync(token, {
                    secret: this.config.get<string>("JWT_SECRET")
                });
                request[CURRENT_USER_KEY] = payload;
            } catch (error) {
                throw new  UnauthorizedException("invalid token  ")
            }
        }
        else {
            throw new  UnauthorizedException("no token provided  ")
        }
        return true;
       
    }

}