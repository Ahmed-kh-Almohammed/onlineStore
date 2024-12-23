import { BadRequestException, Injectable } from "@nestjs/common";
import { RegisterDto } from "./dtos/register.dto";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import * as bcrypt from "bcryptjs"
import { LoginDto } from "./dtos/login.dto";
import { JwtService } from "@nestjs/jwt";
import {JWTPayloadType,AccessTokenType}from"../utils/types"


@Injectable()
export class  AuthProvider {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,
       private readonly jwtservice:JwtService
     ) { }
    /**
     * Create new user
     * @param registerDto data for creating new user
     * @returns JWT (access Token)
     */
    public async register(registerdto: RegisterDto): Promise<AccessTokenType> {
        const { email, password, username } = registerdto;
        const userFromDb = await this.userRepository.findOne({ where: { email } });
        if (userFromDb) {
            throw new BadRequestException("user already exist")
        }
        
        const hashPassword = await this.hashPassword(password);
        let newUser = await this.userRepository.create({ email, username, password: hashPassword });
        newUser = await this.userRepository.save(newUser);

        const accessToken=await this.generateJwt({id:newUser.id,userType:newUser.userType});
        return {accessToken};
    }
    /**
     * Login User 
     * @param logindto data for log in to user account
     * @returns JWT (access token)
     */

    public async login(logindto: LoginDto) :Promise<AccessTokenType>{
        const { email, password } = logindto;
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) throw new BadRequestException("invalid email or password")
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) { 
           throw new BadRequestException("invalid email or password")
        }
        const accessToken=await this.generateJwt({id:user.id,userType:user.userType});
        return {accessToken};
    }
    
    /**
     * generate web token
     * @param payload jwt payload
     * @returns access token
     */

    private generateJwt(payload:JWTPayloadType):Promise<string>{
        return this.jwtservice.signAsync(payload);
    }

    /**
     * hashing password
     * @param password plain text password
     * @returns hashed password
     */
    public async hashPassword(password:string):Promise<string>{
        const salt=await bcrypt.genSalt(10);
        return  bcrypt.hash(password,salt);
    }

}