import { IsString, IsNumber, IsNotEmpty, Min, MinLength, MaxLength } from 'class-validator'
export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(150)
    title: string;

    @IsString()
    @MinLength(5)
    description:string;
    @IsNumber()
    @IsNotEmpty()
    @Min(0,{message :"this is custom message price can not be negative"})
    price: number;
}