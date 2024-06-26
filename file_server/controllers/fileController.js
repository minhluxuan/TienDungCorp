const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const AdmZip = require('adm-zip');
const HttpStatus = require("../models/HttpStatus");
const Response = require("../models/Response");
const fileService = require("../services/fileService");
const validationService = require("../services/validationService");
const DiskStorage = require("../models/DiskStorage");

const get = async (req, res) => {
    try {
        const {error} = validationService.validateGettingFile(req.query);
        if (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(new Response(false, error.message));
        }

        const filePath = path.join(__dirname, "..", "uploads", "main", ...req.query.path.split('/'));
        if (!fs.existsSync(filePath)) {
            return res.status(HttpStatus.NOT_FOUND).json(new Response(false, "File not found"));
        }

        const fileName = req.query.path.split('/')[req.query.path.split('/').length - 1];

        const archive = archiver('zip', {
            zlib: { level: 9 }
        });

        if (fs.statSync(filePath).isDirectory()) {
            res.setHeader('Content-Type', 'application/zip');
            res.setHeader('Content-Disposition', 'inline; filename="content.zip"');
            archive.pipe(res);
            await fileService.addFilesToArchive(filePath, '', archive);
            await archive.finalize();
        }
        else {
            if (req.query.option === "default") {
                return res.sendFile(filePath);
            }

            res.setHeader('Content-Type', 'application/zip');
            res.setHeader('Content-Disposition', 'inline; filename="content.zip"');

            archive.on('error', (err) => {
                console.error('Archiver error:', err);
                res.status(500).send('Error creating zip file');
            });

            archive.pipe(res);
        
            archive.file(filePath, { name: fileName });
        
            await archive.finalize();
        }
    } catch (error) {
        console.log(error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(new Response(false, error.message));
    }
}

const checkExistPath = async (req, res) => {
    try {
        if (fs.existsSync(path.join(__dirname, "..", "uploads", "main", req.query.path))) {
            return res.status(HttpStatus.OK).json(new Response(true, "Đường dẫn đã tồn tại", {existed: true}));
        }

        return res.status(HttpStatus.OK).json(new Response(true, "Đường dẫn chưa tồn tại", {existed: false}));
    } catch (error) {
        console.log(error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(new Response(false, "Đã xảy ra lỗi. Vui lòng thử lại"));
    }
}

const upload = async (req, res) => {
    try {
        const { error } = validationService.validateUploadingFile(req.query);
        if (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(new Response(false, error.message));
        }

        const mainDirectoryPath = path.join(__dirname, '..', 'uploads', 'main');
        const tempDirectoryPath = path.join(__dirname, '..', 'uploads', 'temp');

        if (!req.file) {
            return res.status(HttpStatus.BAD_REQUEST).json(new Response(false, "No file uploaded"));
        }

        if (path.extname(req.file.originalname) === '.zip') {
            if (req.query.option === "zip") {
                return res.status(HttpStatus.BAD_REQUEST).json(new Response(false, "Unable to zip"));
            }

            const tempFilePath = path.join(tempDirectoryPath, req.file.originalname);
            if (!fs.existsSync(tempFilePath)) {
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(new Response(false, "Internal server error"));
            }

            if (req.query.option === "default") {
                const mainFilePath = path.join(mainDirectoryPath, ...req.query.path.split('/'), req.file.originalname);
                if (fs.existsSync(mainFilePath)) {
                    fs.unlinkSync(tempFilePath);
                    return res.status(HttpStatus.CONFLICT).json(new Response(false, "File has existed"));
                }

                fileService.createDirectoriesFromMain(req.query.path);

                fs.renameSync(tempFilePath, mainFilePath);
                return res.status(HttpStatus.CREATED).json(new Response(true, "File uploaded successfully"));
            }

            const mainFilePath = path.join(mainDirectoryPath, ...req.query.path.split('/'), path.basename(req.file.originalname, ".zip"));
            if (fs.existsSync(mainFilePath)) {
                fs.unlinkSync(tempFilePath);
                return res.status(HttpStatus.CONFLICT).json(new Response(false, "Directory has existed"));
            }

            fileService.createDirectoriesFromMain(req.query.path);
            const unzipFolderPath = path.join(mainDirectoryPath, ...req.query.path.split('/'), path.basename(req.file.originalname, '.zip'));
            const zip = new AdmZip(tempFilePath);
            zip.extractAllTo(unzipFolderPath, true);

            const isValidFile = await DiskStorage.checkFileType(unzipFolderPath);
            if (!isValidFile) {
                fs.rmSync(unzipFolderPath, { recursive: true, force: true });
                return res.status(HttpStatus.BAD_REQUEST).json(new Response(false, "Contains invalid file type"));
            }

            fs.unlinkSync(tempFilePath);
            
            return res.status(HttpStatus.CREATED).json(new Response(true, "Upload successfully"));
        } else {
            if (req.query.option === "unzip") {
                return res.status(HttpStatus.BAD_REQUEST).json(new Response(false, "Unable to unzip"));
            }

            const tempFilePath = path.join(tempDirectoryPath, req.file.originalname);
            if (!fs.existsSync(tempFilePath)) {
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(new Response(false, "Internal server error"));
            }

            if (req.query.option === "default") {
                const mainFilePath = path.join(mainDirectoryPath, ...req.query.path.split('/'), req.file.originalname);
                if (fs.existsSync(mainFilePath)) {
                    fs.unlinkSync(tempFilePath);
                    return res.status(HttpStatus.CONFLICT).json(new Response(false, "File has existed"));
                }

                fileService.createDirectoriesFromMain(req.query.path);

                fs.renameSync(tempFilePath, mainFilePath);
                return res.status(HttpStatus.CREATED).json(new Response(true, "Upload successfully"));
            }

            const mainFilePath = path.join(mainDirectoryPath, ...req.query.path.split('/'), req.file.originalname.replace(/\.[^/.]+$/, '') + ".zip");
            if (fs.existsSync(mainFilePath)) {
                fs.unlinkSync(tempFilePath);
                return res.status(HttpStatus.CONFLICT).json(new Response(false, "File has existed"));
            }

            const output = fs.createWriteStream(mainFilePath);

            const archive = archiver('zip', {
                zlib: { level: 9 }
            });

            archive.pipe(output);

            archive.file(tempFilePath, { name: req.file.originalname });

            archive.finalize();

            archive.on('end', () => {
                fs.unlinkSync(tempFilePath);
                return res.status(HttpStatus.CREATED).json(new Response(true, "Upload successfully"));
            });

            archive.on('error', (err) => {
                console.error('Error occurred while archiving:', err);
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(new Response(false, "Internal server error"));
            });
        }
    } catch (error) {
        console.error('Error extracting zip file:', error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(new Response(false, "Internal server error"));
    }
};

const remove = async (req, res) => {
    try {
        const filePath = path.join(__dirname, "..", "uploads", "main", req.query.path);

        if (!fs.existsSync(filePath)) {
            return res.status(HttpStatus.NOT_FOUND).json(new Response(false, "File not found"));
        }

        if (fs.statSync(filePath).isDirectory()) {
            fs.rmSync(filePath, { recursive: true, force: true });        
        }
        else {
            fs.unlinkSync(filePath);
        }

        return res.status(HttpStatus.OK).json(new Response(true, "Delete successfully"));   
    } catch (error) {
        console.log(error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(new Response(false, "Internal server error"));
    }
};

const createDirectory = (req, res) => {
    try {
        const dirPath = path.join(__dirname, "..", "uploads", "main", req.query.path);
        if (fs.existsSync(dirPath)) {
            return res.status(HttpStatus.CONFLICT).json(new Response(false, "Thư mục đã tồn tại"));
        }
        
        fileService.createDirectoriesFromMain(req.query.path);
        return res.status(HttpStatus.CREATED).json(new Response(true, "Tạo thư mục thành công"));
    } catch (error) {
        console.log(error.message);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(new Response(false, "Tạo thư mục thất bại"));
    }
}

module.exports = {
    get,
    checkExistPath,
    upload,
    remove,
    createDirectory,
}