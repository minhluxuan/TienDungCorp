import { Injectable, BadRequestException, ValidationPipe } from '@nestjs/common';

@Injectable()
export class FileTypeValidator extends ValidationPipe {
    constructor(private readonly allowedTypes: string[]) {super()}

    transform(value: any) {
        if (!this.isValidFileType(value.mimetype)) {
            throw new BadRequestException(`File không hợp lệ. Chỉ các loại file: ${this.allowedTypes.join(', ')} được cho phép`);
        }
        return value;
    }

    private isValidFileType(fileType: string): boolean {
        return this.allowedTypes.includes(fileType);
    }
}
