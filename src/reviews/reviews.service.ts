import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Review } from "./review.entity";
import { Repository } from "typeorm";
import { UsersModule } from "src/users/users.module";
import { UsersService } from "src/users/users.service";
import { ProductService } from "src/products/products.service";
import { ReviewDto } from "./dtos/create-review.dto";
import { UpdateReviewDto } from "./dtos/update-review.dto";
import { JWTPayloadType } from "src/utils/types";
import { UserType } from "src/utils/enums";


@Injectable()
export default class ReviewsService {

    constructor(
        @InjectRepository(Review) private readonly reviewsRepository: Repository<Review>,
        private readonly usersservice: UsersService,
        private readonly productsService: ProductService
    ) { }


    /**
     * create a new review
     * @param userId 
     * @param productId 
     * @param dto reviewDto
     * @returns created review
     */

    public async createReview(userId: number, productId: number, dto: ReviewDto) {
        const user = await this.usersservice.getCurrentUser(userId);
        const product = await this.productsService.getOneBy(productId);
        const review = this.reviewsRepository.create({ ...dto, user, product });
        return this.reviewsRepository.save(review);
    }

     /**
      * get all review by page number
      * @param pageNumber 
      * @param reviewperPage 
      * @returns collection of review
      */
    public getAll(pageNumber:number,reviewperPage:number) {
        return this.reviewsRepository.find({ 
            skip:reviewperPage*(pageNumber-1),
            take:reviewperPage,
            order: { createdDate: "DESC" },});
    }

    /**
     * upate review 
     * @param reviewId 
     * @param userId 
     * @param dto 
     * @returns updated review
     */
    public async update(reviewId: number, userId: number, dto: UpdateReviewDto) {
        const review = await this.getReviewBy(reviewId);
        if (userId !== review.user.id) throw new ForbiddenException("access denied , you are not allowed");
        review.rating = dto.rating ?? review.rating;
        review.comment = dto.comment ?? review.comment;
        return this.reviewsRepository.save(review);

    }
    /**
     * delte message
     * @param reviewId 
     * @param payload 
     * @returns a message 
     */
    public async delete(reviewId: number, payload: JWTPayloadType) {
        const review = await this.getReviewBy(reviewId);
        if (!review) throw new NotFoundException("this review not found");
        if (payload.id === review.user.id || payload.userType === UserType.ADMIN) {
            await this.reviewsRepository.remove(review);
            return { message: "this review has been deleted" }
        }
        else throw new ForbiddenException("you are not allowed");
    }


    /**
     * get single review by id 
     * @param id 
     * @returns single review 
     */

    private async getReviewBy(id: number) {
        const review = await this.reviewsRepository.findOne({ where: { id } });
        if (!review) {
            throw new NotFoundException("review not found")
        }
        return review;
    }

}