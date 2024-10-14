import { IsEnum, IsString } from "class-validator";
import { NewsType } from "src/common/contants";

export class CreateProjectDto {
    @IsString({ message: 'Project name must be a string'})
    name: string;

    @IsString({ message: 'Project title must be a string'})
    title: string;

    @IsEnum(NewsType, { message: 'Type is invalid'})
    type: NewsType;
}