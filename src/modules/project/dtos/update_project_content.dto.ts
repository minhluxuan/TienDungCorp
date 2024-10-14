import { IsOptional, IsString } from "class-validator";

export class UpdateProjectContentDto {
    @IsOptional()
    @IsString({ message: 'Content must be a string' })
    content: string;
}