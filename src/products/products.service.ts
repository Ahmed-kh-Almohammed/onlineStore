import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateProductDto } from "./dtos/create-product-dto";
import { UpdateProductDto } from "./dtos/update-product-dto";
import { UsersService } from "src/users/users.service";
import { Between, Like, Repository } from "typeorm";
import { Product } from "./products.entity";
import { InjectRepository } from "@nestjs/typeorm";




@Injectable()
export class ProductService{
    
  
    constructor(  @InjectRepository(Product)
        private readonly ProductRepository:Repository<Product>,
        private readonly usersservice:UsersService
    ){

    }
    /**
     * Create a new Product
     *  @param dto for creation new product
     *  @param userId id for logged in user(Admin)
     *  @returns the created product from database
     * */ 

    public async CreateProduct( dto: CreateProductDto,userId:number) {
     const user=await this.usersservice.getCurrentUser(userId);
     const newProduct=this.ProductRepository.create({
        ...dto,
        title:dto.title.toLowerCase(),
        user
     });
     return   this.ProductRepository.save(newProduct);
    }
    /**
     * 
     * GET all products
     */
    public  getAll(title?:string,minPrice?:string,maxPrice?:string) {
        const filter ={
            ...(title? {title:Like(`%${title.toLowerCase()}%`)}:{}),
            ...(minPrice&&maxPrice?{price:Between(parseInt(minPrice),parseInt(maxPrice))}:{})
        }
        return this.ProductRepository.find({where:filter});
    }
    /**
     *  Get single product
     * @param id of the product
     * @returns product from the database
     * 
     */
    public async getOneBy(id: number) {

       
        const product=  await this.ProductRepository.findOne({where:{id},relations:{user:true,reviews:true}});
        if(!product)throw new NotFoundException("Product not found");
        return product;
    }
    /**
     * update product 
     * @param id of the product
     * @param dto data for updateing product
     * @return updated product
     */
    public  async update( id: number, body: UpdateProductDto) {

        const product = await this.getOneBy(id);
        product.title = body.title?? product.title;
        product.description=body.description??product.description;
        product.price=body.price??product.price;
        return await this.ProductRepository.save(product);
    }
    /**
     * delete singe product
     * @param id of product
     * @return success message
     */
    public async delete( id: number) {

        const product = await this.getOneBy(id);
        if (!product) throw new NotFoundException("product not found", {
            description: ""
        });
         await this.ProductRepository.remove(product);
         return {message:'product deleted'}
    }
}