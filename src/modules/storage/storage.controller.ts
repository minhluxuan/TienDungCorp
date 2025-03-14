import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, NotFoundException, Param, Post, Query, Res, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { StorageService } from "./storage.service";
import { JwtAuthGuard } from "src/common/guards/authenticate.guard";
import { FilesInterceptor } from "@nestjs/platform-express";
import { CustomParseFilePipe } from "src/common/pipes/custome_parse_file.pipe";
import { UploadFileDto } from "./dtos/upload.dto";
import { Response } from "../response/response.entity";
import { UUID } from "crypto";

@Controller('file')
export class StorageController {
    constructor(
        private readonly storageService: StorageService,
        private readonly response: Response
    ) {}

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FilesInterceptor("files"))
    @Post('upload')
    async upload(
        @Body() dto: UploadFileDto,
        @UploadedFiles(new CustomParseFilePipe({
            maxSize: 50000000,
            fileTypes: ['image/png', 'image/jpg', 'image/jpeg']
        })) files: Express.Multer.File[],
        @Res() res
    ) {
        try {
            const uploadedFile = await this.storageService.upload(dto.projectId, files);
            this.response.initResponse(true, 'Upload file successfully', uploadedFile);
            return res.status(HttpStatus.OK).json(this.response);
        } catch (error) {
            if (error instanceof NotFoundException) {
                this.response.initResponse(false, error.message, null);
                return res.status(HttpStatus.NOT_FOUND).json(this.response);
            }

            console.log(error);
            this.response.initResponse(false, "Internal server error", null);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
        }
    }

    @Get('download')
    async get(@Query('path') filePath: string, @Res() res) {
        try {
            const file = await this.storageService.getFileByPath(`${filePath}`);
            file.getStream().pipe(res);   
        } catch (error) {
            if (error instanceof NotFoundException) {
                this.response.initResponse(false, error.message, null);
                return res.status(HttpStatus.NOT_FOUND).json(this.response);
            }

            console.log(error);
            this.response.initResponse(false, "Internal server error", null);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Delete('delete/:id')
    async remove(@Param('id') id: UUID, @Res() res) {
        try {
            await this.storageService.remove(id, false);
            this.response.initResponse(true, 'Delete file successfully', null);
            return res.status(HttpStatus.OK).json(this.response);
        } catch (error) {
            if (error instanceof NotFoundException) {
                this.response.initResponse(false, error.message, null);
                return res.status(HttpStatus.NOT_FOUND).json(this.response);
            }

            if (error instanceof BadRequestException) {
                this.response.initResponse(false, error.message, null);
                return res.status(HttpStatus.BAD_REQUEST).json(this.response);
            }

            console.log(error);
            this.response.initResponse(false, "Internal server error", null);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
        }
    }
}