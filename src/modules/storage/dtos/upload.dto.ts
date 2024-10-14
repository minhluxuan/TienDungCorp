import { IsUUID } from "class-validator";
import { UUID } from "crypto";

export class UploadFileDto {
    @IsUUID('4', { message: 'Project ID must be a version 4 UUID' })
    projectId: UUID;
}