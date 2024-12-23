import { BadRequestException, Controller, Post ,UploadedFile,UseInterceptors,Res, Param, Get, UploadedFiles} from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { error } from "console";
import { Express } from "express";
import { diskStorage } from "multer";
import { Response } from "express";
@Controller("api/uploads")
export class UploadsController{


    //post ~/api/uploads
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    public uploadFile(@UploadedFile() file :Express.Multer.File){
        if(!file)throw new BadRequestException("no file provided")
        console.log("file uploaded",{file});
        return {message:"file uploaded successfully"}
    }

    //post ~/api/uploads/multiple-files
    @Post("multiple-files")
    @UseInterceptors(FilesInterceptor("files"))
    public uploadMultiFiles(@UploadedFiles() files :Array<Express.Multer.File>){
        if(!files||files.length===0)throw new BadRequestException("no files provided")
        console.log("files uploaded",{files});
        return {message:"files uploaded successfully"}
    }
    //GET: ~api/uploads/:image
    @Get(":image")
    public showUploadedImage(@Param("image") image:string,@Res() res:Response){
             return res.sendFile(image,{root:"images"})
    }

    

}