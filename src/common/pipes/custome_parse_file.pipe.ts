import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

interface CustomParseFilePipeOptions {
    maxSize: number;
    fileTypes: string[];
}

@Injectable()
export class CustomParseFilePipe implements PipeTransform {
    private readonly maxSize: number;
    private readonly fileTypes: string[];

    constructor(options: CustomParseFilePipeOptions) {
        this.maxSize = options.maxSize;
        this.fileTypes = options.fileTypes;
    }

    async transform(value: any): Promise<any> {
        if (!value) {
            return value;
        }

        if (Array.isArray(value)) {
            this.validateFiles(value);
        } else if (typeof value === 'object') {
            Object.keys(value).forEach(key => {
                const files = value[key];
                if (Array.isArray(files)) {
                    this.validateFiles(files);
                }
            });
        }

        return value;
    }

    private validateFiles(files: Express.Multer.File[]) {
        this.validateFileSize(files);
        this.validateFileType(files);
    }

    private validateFileSize(files: Express.Multer.File[]) {
        files.forEach((f) => {
            if (f.size > this.maxSize) {
                throw new BadRequestException(`File size is not allowed to exceed ${this.maxSize} bytes`);
            }
        });
    }

    private validateFileType(files: Express.Multer.File[]) {
        files.forEach((f) => {
            const fileMimeType = f.mimetype;
            const allowedFileTypes = this.fileTypes.map(type => type.toLowerCase());

            if (!allowedFileTypes.includes(fileMimeType)) {
                throw new BadRequestException(`File type ${fileMimeType} is not allowed. File types which are allowed: ${allowedFileTypes.join(', ')}`);
            }
        });
    }
}
