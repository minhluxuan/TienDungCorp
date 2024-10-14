import { FileValidator } from '@nestjs/common';

export class CustomFileTypeValidator extends FileValidator<{ fileType: string[] }> {
  constructor(protected readonly validationOptions: { fileType: string[] }) {
    super(validationOptions);
  }

  isValid(file: Express.Multer.File): boolean {
    return this.validationOptions.fileType.includes(file.mimetype);
  }

  buildErrorMessage(): string {
    return `File không hợp lệ. Chỉ các loại file: ${this.validationOptions.fileType.join(', ')} được cho phép`;
  }
}
