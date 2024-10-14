import { BadRequestException, Inject, Injectable, NotFoundException, StreamableFile } from "@nestjs/common";
import { UUID } from "crypto";
import { FILE_REPOSITORY, PROJECT_REPOSITORY } from "src/common/contants";
import { File } from "./file.entity";
import { Project } from "../project/project.entity";
import { basename, extname, join } from "path";
import { v4 as uuidv4 } from 'uuid';
import { createReadStream, existsSync, access } from "fs";
import * as fs from 'fs';

@Injectable()
export class StorageService {
    constructor(
        @Inject(FILE_REPOSITORY) private readonly fileRepository: typeof File,
        @Inject(PROJECT_REPOSITORY) private readonly projectRepository: typeof Project
    ) {}

    async upload(projectId: UUID, files: Express.Multer.File[]) {
        const existedProject = await this.projectRepository.findByPk(projectId);

        if (!existedProject) {
            throw new NotFoundException('Project does not exist');
        }

        const uploadedFiles = [];

        for (const file of files) {
            const fileExtName = basename(file.originalname);
            const randomName = uuidv4();

            const filename = `${randomName}_${fileExtName}`;
            const filePath = `src/modules/storage/uploads/${filename}`;
            await this.saveFileToDisk(filePath, file.buffer);

            const savedFile = await this.fileRepository.create({
                name: basename(file.originalname),
                path: filePath,
                projectId: projectId
            });

            if (savedFile) {
                uploadedFiles.push(savedFile);
            }
        }

        return uploadedFiles;
    }

    private async saveFileToDisk(filePath: string, buffer: Buffer) {
        const fs = require('fs');
        return new Promise((resolve, reject) => {
            fs.writeFile(filePath, buffer, (err) => {
                if (err) {
                    console.log(err);
                reject(new BadRequestException('Error saving file'));
                } else {
                resolve(true);
                }
            });
        });
    }

    async getFileByPath(filePath: string): Promise<StreamableFile> {
        const fullPath = join(process.cwd(), filePath);

        if (!existsSync(fullPath)) {
            throw new NotFoundException('File does not exist');
        }

        const fileStream = createReadStream(fullPath);
        return new StreamableFile(fileStream);
    }

    async updateFileContent(filePath: string, content: string) {
        const fullPath = join(process.cwd(), filePath);

        await fs.promises.access(fullPath).catch(() => {
            throw new NotFoundException(`File at path "${filePath}" does not exist`);
        });

        await fs.promises.writeFile(fullPath, content, 'utf8');
    }

    async remove(id: UUID, allowedToDestroyMainFile: boolean) {
        const existedFile = await this.fileRepository.findByPk(id);

        if (!existedFile) {
            throw new NotFoundException('File does not exist');
        }

        if (!allowedToDestroyMainFile) {
            if (existedFile.name == 'main.html') {
                throw new BadRequestException('main.html can not be destroyed');
            }
        }

        existedFile.destroy()

        if (existedFile.path) {
            try {
                fs.unlinkSync(existedFile.path);
                console.log(`Delete file at path ${existedFile.path} successfully`);
            } catch (err) {
                console.error(`Error deleting file at path ${existedFile.path}`, err);
            }
        }
    }

    async removeFileByPath(filePath: string) {
        try {
            fs.unlinkSync(filePath);
            console.log(`Delete file at path ${filePath} successfully`);
        } catch (err) {
            console.error(`Error deleting file at path ${filePath}`, err);
        }
    }
}