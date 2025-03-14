import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, NotFoundException, Param, Post, Put, Req, Res, UseGuards, UsePipes } from "@nestjs/common";
import { ProjectService } from "./project.service";
import { CreateProjectDto } from "./dtos/create_project.dto";
import { Response } from "../response/response.entity";
import { ValidateInputPipe } from "src/common/pipes/validate.pipe";
import { JwtAuthGuard } from "src/common/guards/authenticate.guard";
import { SearchPayload } from "src/common/interfaces/search_payload.interface";
import { UpdateProjectDto } from "./dtos/update_project.dto";
import { UUID } from "crypto";
import { UpdateProjectContentDto } from "./dtos/update_project_content.dto";

@Controller('project')
export class ProjectController {
    constructor(
        private readonly projectService: ProjectService,
        private readonly response : Response,
    ) {}

    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidateInputPipe)
    @Post('create')
    async create(@Req() req, @Body() dto: CreateProjectDto, @Res() res) {
        try {
            const createdProject = await this.projectService.create(req.user.id, dto);
            this.response.initResponse(true, 'Create project successfully', createdProject);
            return res.status(HttpStatus.CREATED).json(this.response);
        } catch (error) {
            if (error instanceof BadRequestException) {
                this.response.initResponse(false, error.message, null);
            }

            console.log(error);
            this.response.initResponse(false, 'Internal server error. Please try again', null);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
        }
    }

    @UsePipes(ValidateInputPipe)
    @Post('search')
    async search(@Body() searchPayload: SearchPayload, @Res() res) {
        try {
            const projects = await this.projectService.search(searchPayload);
            this.response.initResponse(true, 'Search projects successfully', projects);
            return res.status(HttpStatus.OK).json(this.response);
        } catch (error) {
            console.log(error);
            if (error.name === 'SequelizeDatabaseError') {
                console.log(error);
                this.response.initResponse(false, 'Internal server error', null);
                return res.status(HttpStatus.BAD_REQUEST).json(this.response);
            }

            this.response.initResponse(false, "An error occurs. Please try again", null);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
        }
    }

    @UsePipes(ValidateInputPipe)
    @Get('search/:id')
    async searchById(@Param('id') id: UUID, @Res() res) {
        try {
            const project = await this.projectService.searchById(id);
            this.response.initResponse(true, 'Search project successfully', project);
            return res.status(HttpStatus.OK).json(this.response);
        } catch (error) {
            console.log(error);
            if (error.name === 'SequelizeDatabaseError') {
                console.log(error);
                this.response.initResponse(false, 'Internal server error', null);
                return res.status(HttpStatus.BAD_REQUEST).json(this.response);
            }

            this.response.initResponse(false, "An error occurs. Please try again", null);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
        }
    }

    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidateInputPipe)
    @Put('update/:id')
    async update(@Param('id') id: UUID, @Body() payload: UpdateProjectDto, @Res() res) {
        try {
            const updatedProject = await this.projectService.update(id, payload);
            this.response.initResponse(false, "Update project successfully", updatedProject);
            return res.status(HttpStatus.CREATED).json(this.response);
        } catch (error) {
            if (error instanceof NotFoundException) {
                this.response.initResponse(false, error.message, null);
                return res.status(HttpStatus.NOT_FOUND).json(this.response);
            }

            console.log(error);
            this.response.initResponse(false, "An error occurs. Please try again", null);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
        }
    }

    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidateInputPipe)
    @Put('content/update/:id')
    async updateContent(@Param('id') id: UUID, @Body() payload: UpdateProjectContentDto, @Res() res) {
        try {
            const updatedProject = await this.projectService.updateContent(id, payload);
            this.response.initResponse(false, "Update project content successfully", updatedProject);
            return res.status(HttpStatus.CREATED).json(this.response);
        } catch (error) {
            if (error instanceof NotFoundException) {
                this.response.initResponse(false, error.message, null);
                return res.status(HttpStatus.NOT_FOUND).json(this.response);
            }

            console.log(error);
            this.response.initResponse(false, "An error occurs. Please try again", null);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
        }
    }

    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidateInputPipe)
    @Delete('delete/:id')
    async remove(@Param('id') id: UUID, @Res() res) {
        try {
            const updatedProject = await this.projectService.remove(id);
            this.response.initResponse(false, "Delete project successfully", updatedProject);
            return res.status(HttpStatus.OK).json(this.response);
        } catch (error) {
            if (error instanceof NotFoundException) {
                this.response.initResponse(false, error.message, null);
                return res.status(HttpStatus.NOT_FOUND).json(this.response);
            }

            console.log(error);
            this.response.initResponse(false, "An error occurs. Please try again", null);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
        }
    }
}