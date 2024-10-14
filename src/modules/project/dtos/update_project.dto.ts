import { IsEnum, IsOptional, IsString } from "class-validator";
import { NewsType } from "src/common/contants";

export class UpdateProjectDto {
    @IsOptional()
    @IsString({ message: 'Project name must be a string'})
    name: string;

    @IsOptional()
    @IsString({ message: 'Project title must be a string'})
    title: string;

    @IsOptional()
    @IsEnum(NewsType, { message: 'Type is invalid'})
    type: NewsType;
}