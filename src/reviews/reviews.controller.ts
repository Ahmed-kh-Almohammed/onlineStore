import { Controller ,Get, Post,Param,Body, ParseIntPipe, UseGuards, Put, Delete, Query} from "@nestjs/common"; 
import ReviewsService from "./reviews.service";
import { CurrrentUser } from "src/users/decorators/current-user.decorator";
import { Roles } from "src/users/decorators/user-role.decorator";
import { AuthRolesGuard } from "src/users/guards/auth-roles.guard";
import { Product } from "src/products/products.entity";
import { ReviewDto } from "./dtos/create-review.dto";
import { JWTPayloadType } from "src/utils/types";
import { useContainer } from "class-validator";
import { UserType } from "src/utils/enums";
import { User } from "src/users/user.entity";
import { UpdateReviewDto } from "./dtos/update-review.dto";

@Controller("/api/reviews")
export class ReviewsController{

    constructor(private readonly reviewservice:ReviewsService,
        
    ){

    }

    // Post ~/api/reviews
    @Post(":productId")
    @UseGuards(AuthRolesGuard)
    @Roles(UserType.ADMIN,UserType.NORMAL_USER)
    public createNewReview(
        @Param("productId",ParseIntPipe) ProductId:number,
        @Body("") body:ReviewDto,
        @CurrrentUser() payload:JWTPayloadType,
         ){
        return this.reviewservice.createReview(payload.id,ProductId,body);
    }

    // Get ~/api/reviews
    @Get()
    @UseGuards(AuthRolesGuard)
    @Roles(UserType.ADMIN)
    public getAllReviews(@Query("pageNumber",ParseIntPipe) pageNum:number
    ,@Query("reviewperPage",ParseIntPipe)reviewperPage:number){
        return this.reviewservice.getAll(pageNum,reviewperPage);
    }

    //Put ~/api/reviews/id
    @Put(":id")
    @UseGuards(AuthRolesGuard)
    @Roles(UserType.ADMIN,UserType.NORMAL_USER)
    public updateReview(@Param("id",ParseIntPipe) id:number,
    @CurrrentUser() payload:JWTPayloadType,@Body() dto:UpdateReviewDto){
        return this.reviewservice.update(id,payload.id,dto);
    }

    //Delete ~/api/reviews/id
    @Delete(":id")
    @UseGuards(AuthRolesGuard)
    @Roles(UserType.ADMIN,UserType.NORMAL_USER)
    public deleteReview(@Param("id",ParseIntPipe) id:number,@CurrrentUser() payload:JWTPayloadType){
        return this.reviewservice.delete(id,payload);
    }
}