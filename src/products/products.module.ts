import { Module } from "@nestjs/common";
import { ProductsController } from "./products.controller";
import { ProductService } from "./products.service";
import { UsersModule } from "src/users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./products.entity";
import { UsersService } from "src/users/users.service";
import { JwtModule } from "@nestjs/jwt";

@Module({
    controllers:[ProductsController],
    providers:[ProductService],
    imports:[TypeOrmModule.forFeature([Product]),UsersModule,JwtModule],
    exports :[ProductService]
   
})
export class ProductsModule{


}