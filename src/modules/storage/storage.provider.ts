import { FILE_REPOSITORY } from "src/common/contants";
import { File } from "./file.entity";

export const storageProvider = [
    {
        provide: FILE_REPOSITORY,
        useValue: File
    }
]