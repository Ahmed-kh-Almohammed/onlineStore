import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, MaxLength, MinLength } from "class-validator";

export class RegisterDto{
    @IsEmail()
    @MaxLength(250)
    email:string;
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password:string;
    @IsOptional()
    @Length(2,150)
    username:string;

}