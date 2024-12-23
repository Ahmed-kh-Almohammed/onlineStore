import { BadRequestException, Module } from "@nestjs/common";
import { UploadsController } from "./uploads.controller";
import { MulterModule } from "@nestjs/platform-express";
import { diskStorage } from "multer";



@Module({
    controllers:[UploadsController],
    imports:[MulterModule.register({
        storage:diskStorage({destination:"./images",
            filename:(req,file,cb)=>{
               const prefix=`${Date.now()}-${Math.round(Math.random()*1e6)}`
               const filename=`${prefix}-${file.originalname}`
               cb(null,filename );
            }}),
            fileFilter :(req,file,cb)=>{
               if(file.mimetype.startsWith("image"))cb(null,true);
               else {
                cb(new BadRequestException("only images supported"),false);
               }
            },
            limits:{fileSize:1024*1024*2}// 2 mega byte 
        
    })]
})
export class UploadModule{
   
}