import { IsNotEmpty, IsNumber, Length, Min,IsString,IsOptional, MinLength } from "class-validator"
export class UpdateProductDto {
    @Length(2,150)
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    @MinLength(5)
    description?:string;

    @Min(0,{message:"price should not be negative "})
    @IsNumber()
    @IsNotEmpty()
    @IsOptional()
    price?: number;
}