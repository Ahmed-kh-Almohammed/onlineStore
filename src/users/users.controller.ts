import { Body, Controller,
    Get, HttpCode,
     HttpStatus, Post
     ,Headers, UseGuards, 
    Req, Put, 
    Delete, Param,
     ParseIntPipe ,UseInterceptors,
     Logger,
     BadRequestException,
     UploadedFile,
     Res} from "@nestjs/common";
import { UsersService } from "./users.service";
import { RegisterDto } from "./dtos/register.dto";
import { LoginDto } from "./dtos/login.dto";
import { AuthGuard } from "./guards/auth.guard";
import { CURRENT_USER_KEY } from "src/utils/constants";
import { CurrrentUser } from "./decorators/current-user.decorator";
import { JWTPayloadType } from "src/utils/types";
import { Roles } from "./decorators/user-role.decorator";
import { UserType } from "src/utils/enums";
import { AuthRolesGuard } from "./guards/auth-roles.guard";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { Express } from "express";
import { Response } from "express";
@Controller("/api/users")
export class UsersController{

    constructor(private readonly usersservice:UsersService,
      
    ){}
    @Post("auth/register")
    public register (@Body() body:RegisterDto){
        return this.usersservice.register(body);
    }
    @Post("auth/login")
    @HttpCode(HttpStatus.OK)
    public login(@Body() body:LoginDto){
        return this.usersservice.login(body);
    }

    // Get ~/api/users/current-user

    @Get("current-user")
    @UseGuards(AuthGuard)
  
    public getCurrentUser(@CurrrentUser() payload:JWTPayloadType){
        console.log("get current user")
        return this.usersservice.getCurrentUser(payload.id);
    }
    //Get ~/api/users
    @Get()
    @Roles(UserType.ADMIN)
    @UseGuards(AuthRolesGuard)

    public getAllUsers(){
        return this.usersservice.getAll();
    }

    //Put ~/api/users
     @Put()
     @Roles(UserType.ADMIN,UserType.NORMAL_USER)
     //@UseGuards(AuthRolesGuard)
    public udpateUser(@Body() body:UpdateUserDto,@CurrrentUser() payload:JWTPayloadType){
        return this.usersservice.update(payload.id,body);
    }

    //Delete ~/api/users/id

    @Delete(":id")
    @Roles(UserType.ADMIN,UserType.NORMAL_USER)
    @UseGuards(AuthRolesGuard)
    public deleteUser(@Param("id",ParseIntPipe) id:number,@CurrrentUser() payload:JWTPayloadType){
       return this.usersservice.delete(id,payload);
    }

    //Post : ~api/users/upload-image
    @Post("upload-image")
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor("user-image",{
        storage: diskStorage ({
           destination:"./images/users",
           filename:(req,file,cb)=>{

             const prefix= `${Date.now()}-${Math.round(Math.random()*1e6)}`;
             const filename=`${prefix}-${file.originalname}`;
             cb(null,filename);
           }
        }),
        fileFilter:(req,file,cb)=>{
            if(file.mimetype.startsWith("image"))cb(null,true);
            else cb(new BadRequestException("unsupported file formate"),false);
        },
        limits:{fileSize:1024*1024}
    }))
    public UploadProfileImage(@UploadedFile() file:Express.Multer.File,
    @CurrrentUser() payload:JWTPayloadType){
      if(!file)throw new BadRequestException("no image provided");
      return this.usersservice.setProfileImage(payload.id,file.filename);
    }

    @Delete("images/remove-profile-image")
    @UseGuards(AuthGuard)
    public removeProfileImage(@CurrrentUser() paylod:JWTPayloadType){
          return this.usersservice.removeProfileImage(paylod.id);
    }
    @Get("images/:image")
    @UseGuards(AuthGuard)
    public showProfileImage(@Param("image")image :string,
              @Res() res:Response){
              return res.sendFile(image,{root:"images/users"});
    }

}