import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    NotFoundException,
    Put,
    Delete,
    ParseIntPipe ,
    Req,
    Res,
    Headers,
    ValidationPipe,
    Query,
    UseGuards
} from "@nestjs/common";
import { Request, Response } from "express"
import { CreateProductDto } from "./dtos/create-product-dto";
import { UpdateProductDto } from "./dtos/update-product-dto";
import { ProductService } from "./products.service";
import { CurrrentUser } from "src/users/decorators/current-user.decorator";
import { AuthRolesGuard } from "src/users/guards/auth-roles.guard";
import { JWTPayloadType } from "src/utils/types";
import { Roles } from "src/users/decorators/user-role.decorator";
import { UserType } from "src/utils/enums";
import { min } from "class-validator";

type ProductType = { id: number, title: string, price: number };

@Controller("/api/products")
export class ProductsController {

 
    constructor(private readonly productservice:ProductService){

    }
    //POST :~/api/products
    @Post()
    @UseGuards(AuthRolesGuard)
    @Roles(UserType.ADMIN)

    public CreatNewProduct(@Body() body: CreateProductDto,@CurrrentUser()payload:JWTPayloadType) {
        return this.productservice.CreateProduct(body,payload.id);
    }
    //GET : ~/api/products
    @Get()
    public getAllProducts(@Query("title") title:string,
    @Query("minPrice") minPrice:string,@Query("maxPrice") maxPrice:string) {

        return this.productservice.getAll(title,minPrice,maxPrice)
    }
    //GET : ~/api/products/id
    @Get("/:id")
    
    public getSingeProduct(@Param("id",ParseIntPipe) id: number) {

        return this.productservice.getOneBy(id);
    }
    //PUT :~ api/products/id
    @Put("/:id")
    @UseGuards(AuthRolesGuard)
    @Roles(UserType.ADMIN)
    public updateProduct(@Param("id",ParseIntPipe) id: number, @Body() body: UpdateProductDto) {

        return this.productservice.update(id,body);
    }
    //DELETE : ~/api/products/id
    @Delete("/:id")
    @UseGuards(AuthRolesGuard)
    @Roles(UserType.ADMIN)
    public deleteSingeProduct(@Param("id",ParseIntPipe) id: number) {

        
        return this.productservice.delete(id);
    }
}