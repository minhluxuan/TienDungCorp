import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { FILE_REPOSITORY, PROJECT_REPOSITORY } from "src/common/contants";
import { Project } from "./project.entity";
import { CreateProjectDto } from "./dtos/create_project.dto";
import { SearchPayload } from "src/common/interfaces/search_payload.interface";
import { findByCriteria } from "src/common/utils/find_by_criteria.util";
import { File } from "../storage/file.entity";
import { UUID } from "crypto";
import { User } from "../user/user.entity";
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { defaultPost } from "src/common/resources/default_post.template";
import { StorageService } from "../storage/storage.service";
import { UpdateProjectDto } from "./dtos/update_project.dto";
import { NotFoundError } from "rxjs";
import { UpdateProjectContentDto } from "./dtos/update_project_content.dto";

@Injectable()
export class ProjectService {
    constructor(
        @Inject(PROJECT_REPOSITORY) private readonly projectRepository: typeof Project,
        @Inject(FILE_REPOSITORY) private readonly fileRepository: typeof File,
        private readonly storageService: StorageService
    ) {}

    async create(authorId: UUID, dto: CreateProjectDto) {
        if (!authorId) {
            throw new BadRequestException('Author id cannot be empty');
        }

        const createdProject = await this.projectRepository.create({
            name: dto.name,
            title: dto.title,
            type: dto.type,
            authorId
        });

        const filename = `${uuidv4()}_main.html`;
        const filePath = `src/modules/storage/uploads/${filename}`;

        fs.writeFile(filePath, defaultPost, (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return;
            }
            console.log('HTML file has been created successfully.');
        });

        await this.fileRepository.create({
            name: 'main.html',
            path: filePath,
            projectId: createdProject.id
        });

        return await this.projectRepository.findByPk(createdProject.id, {
            include: [
                { 
                    model: User,
                    attributes: ['id', 'username', 'firstName', 'lastName']
                },
                {
                    model: File
                }
            ]
        });
    }

    async search(payload: SearchPayload) {
        return findByCriteria(payload.criteria, Project, payload.addition, {
            option: 'manual',
            includeOption: [
                { model: File },
                { model: User, attributes: ['id', 'username', 'firstName', 'lastName'] }
            ]
        }, null);
    } 

    async searchById(id: UUID) {
        return await this.projectRepository.findByPk(id, {
            include: [
                { model: File },
                { model: User, attributes: ['id', 'username', 'firstName', 'lastName'] }
            ]
        });
    }

    async update(id: UUID, payload: UpdateProjectDto) {
        const existedProject = await this.projectRepository.findByPk(id);

        if (!existedProject) {
            throw new NotFoundException('Project does not exist');
        }

        await this.projectRepository.update(payload, { where: { id }});
        return await this.projectRepository.findByPk(id, {
            include: [
                { 
                    model: User,
                    attributes: ['id', 'username', 'firstName', 'lastName']
                },
                {
                    model: File
                }
            ]
        });
    }

    async updateContent(id: UUID, payload: UpdateProjectContentDto) {
        const existedProject = await this.projectRepository.findByPk(id);

        if (!existedProject) {
            throw new NotFoundException('Project does not exist');
        }

        const existedMainFile = await this.fileRepository.findOne({
            where: {
                projectId: id,
                name: 'main.html'
            }
        });

        if (!existedMainFile) {
            throw new ConflictException('main.html file does not exist');
        }

        await this.storageService.updateFileContent(existedMainFile.path, payload.content);
    }

    async remove(id: UUID) {
        const existedProject = await this.projectRepository.findByPk(id, {
            include: [
                { model: File }
            ]
        });

        if (!existedProject) {
            throw new NotFoundException('Project does not exist');
        }

        await this.projectRepository.destroy({
            where: { id }
        });

        if (existedProject.files && Array.isArray(existedProject.files) && existedProject.files.length > 0) {
            for (const file of existedProject.files) {
                await this.storageService.removeFileByPath(file.path);
            }
        }
    }
}