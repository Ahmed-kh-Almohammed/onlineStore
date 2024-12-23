import {
    IsNotEmpty, IsOptional, IsString, Length
    , MinLength
} from "class-validator";

export class UpdateUserDto {

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @IsOptional()
    password?: string;


    @IsOptional()
    @Length(2, 150)
    @IsString()
    username?: string;

}