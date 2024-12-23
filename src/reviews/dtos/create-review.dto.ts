import { IsNotEmpty, IsNumber, Max, Min, MinLength } from "class-validator";


export class ReviewDto{

    @IsNumber()
    @Min(1)
    @Max(5)
    rating:number;
    @IsNotEmpty()
    @MinLength(2)
    comment:string;
}