import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { RegisterDto } from "./dtos/register.dto";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import * as bcrypt from "bcryptjs"
import { LoginDto } from "./dtos/login.dto";
import { JWTPayloadType, AccessTokenType } from "../utils/types"
import { UpdateUserDto } from "./dtos/update-user.dto";
import { AuthProvider } from "./auth.provider";
import { join } from "node:path"
import { existsSync, unlinkSync } from "node:fs"

@Injectable()
export class UsersService {
   constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,

      private readonly authProvider: AuthProvider
   ) { }
   /**
    * Create new user
    * @param registerDto data for creating new user
    * @returns JWT (access Token)
    */
   public async register(registerdto: RegisterDto): Promise<AccessTokenType> {
      return this.authProvider.register(registerdto);
   }
   /**
    * Login User 
    * @param logindto data for log in to user account
    * @returns JWT (access token)
    */

   public async login(logindto: LoginDto): Promise<AccessTokenType> {
      return this.authProvider.login(logindto);
   }


   public async getCurrentUser(id: number): Promise<User> {

      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) throw new BadRequestException("there are no such this user");
      return user;
   }
   /**
    * Get all users
    * @returns collection of users
    */
   public async getAll(): Promise<User[]> {
      return await this.userRepository.find();
   }
   /**
    * upate user info
    * @param id of logged in user
    * @param updateuserdto data for updating the user
    * @returns updated user from the database
    */
   public async update(id: number, updateuserdto: UpdateUserDto) {
      const { username, password } = updateuserdto;
      const user = await this.userRepository.findOne({ where: { id } });
      user.username = username ?? user.username;
      if (password) {
         user.password = await this.authProvider.hashPassword(password);
      }
      return this.userRepository.save(user);


   }


   /**
    * Delete user
    * @param paramId 
    * @param payload 
    * @returns a success message 
    */
   public async delete(paramId: number, payload: JWTPayloadType) {
      const user = await this.getCurrentUser(paramId);
      if (payload.userType === "Admin" || paramId === user.id) {
         await this.userRepository.remove(user);
         return { message: "user has been deleted" };
      }
      throw new ForbiddenException("you are not allowed")
   }

   /**
    * set profile image
    * @param userId 
    * @param newProfileImage 
    * @returns save user image
    */
   public async setProfileImage(userId: number, newProfileImage: string) {
      const user = await this.getCurrentUser(userId);
      if (user.profileImage) {
         await this.removeProfileImage(userId);
         user.profileImage = newProfileImage;
      }
      else {

         user.profileImage = newProfileImage;

      }

      return this.userRepository.save(user);
   }


   /**
    * remove profile image
    * @param userId 
    * @returns the user from database
    */
   public async removeProfileImage(userId: number) {
      const user = await this.getCurrentUser(userId);
      if (user.profileImage === null) {
         throw new BadRequestException("there is no profile Image");
      }
      const imagePath = join(process.cwd(), `./images/users/${user.profileImage}`);
      if(existsSync(imagePath))
      unlinkSync(imagePath);
      user.profileImage = null
      return this.userRepository.save(user);
   }




}