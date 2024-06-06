const projectService = require("../services/projectService");
const fileService = require("../services/fileService");
const validationService = require("../services/validationService");
const HttpStatus = require("../models/HttpStatus");
const Response = require("../models/Response");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");

const createNewProject = async (req, res) => {
    try {
        const formattedDate = moment().format("YYYY-MM-DD");

        const { error } = validationService.validateCreatingNewProject(req.body);
        if (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(new Response(false, "Thông tin không hợp lệ"));
        }

        if (await projectService.checkExistProject(req.body.name)) {
            return res.status(HttpStatus.NOT_FOUND).json(new Response(false, `Dự án ${req.body.name} đã tồn tại`));
        }

        const response = await axios.get(
            `http://localhost:3001/v1/files/check?path=general_website/project/${req.body.name}`,
            {
                validateStatus: function (status) {
                    return status >= 200 && status <= 500;
                }
            }
        );

        if (response.status < 200 || response.status > 299) {
            return res.status(response.status).json(new Response(false, response.data.message));
        }

        if (response.data.data.existed) {
            return res.status(HttpStatus.CONFLICT).json(new Response(false, `Dự án ${req.body.name} đã tồn tại`));
        }

        const responseCreatingProject = await axios.get(
            `http://localhost:3001/v1/files/create_directory?path=general_website/project/${req.body.name}`,
            {
                validateStatus: function (status) {
                    return status >= 200 && status <= 500;
                }
            }
        );

        if (responseCreatingProject.status < 200 || responseCreatingProject.status > 299) {
            return res.status(response.status).json(new Response(false, "Tạo dự án mới thất bại"));
        }


        const filePath = "./main.html";
        const content = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        <body>
            <p>Hello {"(^^)"}</p>
            <p>
            Nội dung bài viết sẽ được viết ở đây, bạn có thể thêm hình ảnh,
            video, đường dẫn,...
            </p>
            <p>
            <br />
            </p>
        </body>
        </html>
        `;

        fs.writeFileSync(filePath, content, (err) => {
            if (err) {
                console.error('Có lỗi xảy ra khi tạo file:', err);
            } else {
                console.log(`File ${filePath} đã được tạo thành công với nội dung!`);
            }
        });

        const fileStream = fs.createReadStream(filePath);
        const form = new FormData();
        form.append("file", fileStream, "main.html");
        try {
            responseCreatingDefaultFile = await axios.post(
                `http://localhost:3001/v1/files/upload?path=general_website/project/${req.body.name}&option=default`,
                form,
                {
                    headers: {
                        ...form.getHeaders(),
                    },
                    validateStatus: function (status) {
                        return status >= 200 && status <= 500;
                    }
                }
            );
        } catch (error) {
            fs.unlinkSync(filePath);
            return res.status(HttpStatus.CONFLICT).json(new Response(false, error));
        }

        if (response.status < 200 || response.status > 299) {
            fs.unlinkSync(filePath);
            return res.status(response.status).json(new Response(false, response.data.message));
        }
        else
        {
            fs.unlinkSync(filePath);
        }

        const data = new Object({
            id: uuidv4(),
            name: req.body.name,
            author: req.body.author,
            title: req.body.title,
            date_created: formattedDate,
            date_modified: formattedDate,
            type: req.body.type,
            description: req.body.description
        });

        const resultCreatingNewProject = await projectService.saveProject(data);
        if (!resultCreatingNewProject || resultCreatingNewProject.affectedRows === 0) {
            return res.status(HttpStatus.CONFLICT).json(new Response(false, "Tạo dự án mới thất bại"));
        }

        return res.status(HttpStatus.CREATED).json(new Response(true, "Tạo dự án thành công", data))
    } catch (error) {
        console.log(error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(new Response(false, "Đã xảy ra lỗi. Vui lòng thử lại"));
    }
}

const uploadFileBelongToProject = async (req, res) => {
    const uploadDir = path.join(__dirname, '..', 'uploads', 'temp');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, req.file.filename);
    if (!fs.existsSync(filePath) || fs.lstatSync(filePath).isDirectory()) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(new Response(false, "Đã xảy ra lỗi. Vui lòng thử lại."));
    }

    try {
        const formattedDate = moment().format("YYYY-MM-DD");

        const { error } = validationService.validateProjectId(req.query);
        if (error) {
            fs.unlinkSync(filePath);
            return res.status(HttpStatus.BAD_REQUEST).json(new Response(false, "Thông tin không hợp lệ"));
        }

        if (!req.file) {
            return res.status(HttpStatus.BAD_REQUEST).json(new Response(false, "File không được để trống"));
        }

        const resultGettingOneProject = await projectService.getProjectById(req.query.id);
        if (!resultGettingOneProject || resultGettingOneProject.length === 0) {
            fs.unlinkSync(filePath);
            return res.status(HttpStatus.NOT_FOUND).json(new Response(false, "Dự án không tồn tại"));
        }

        const responseCheckingExistProject = await axios.get(
            `http://localhost:3001/v1/files/check?path=general_website/project/${resultGettingOneProject[0].name}`,
            {
                validateStatus: function (status) {
                    return status >= 200 && status <= 500;
                }
            }
        );

        if (responseCheckingExistProject.status < 200 || responseCheckingExistProject.status > 299) {
            fs.unlinkSync(filePath);
            return res.status(responseCheckingExistProject.status).json(new Response(false, responseCheckingExistProject.data.message));
        }

        if (!responseCheckingExistProject.data.data.existed) {
            fs.unlinkSync(filePath);
            return res.status(HttpStatus.CONFLICT).json(new Response(false, "Dự án không tồn tại"));
        }

        const fileStream = fs.createReadStream(filePath);
        const form = new FormData();
        form.append("file", fileStream, req.file.filename);

        let response;
        try {
            response = await axios.post(
                `http://localhost:3001/v1/files/upload?path=general_website/project/${resultGettingOneProject[0].name}&option=default`,
                form,
                {
                    headers: {
                        ...form.getHeaders(),
                    },
                    validateStatus: function (status) {
                        return status >= 200 && status <= 500;
                    }
                }
            );
        } catch (error) {
            fs.unlinkSync(filePath);
            return res.status(HttpStatus.CONFLICT).json(new Response(false, error));
        }

        if (response.status < 200 || response.status > 299) {
            fs.unlinkSync(filePath);
            return res.status(response.status).json(new Response(false, response.data.message));
        }

        const data = new Object({
            project_id: req.query.id,
            file: req.file.filename,
            date_created: formattedDate,
        });

        const resultSavingPost = await fileService.saveFile(data);
        if (!resultSavingPost || resultSavingPost.affectedRows === 0) {
            fs.unlinkSync(filePath);
            throw new Error("Error saving post");
        }

        fs.unlinkSync(filePath);

        return res.status(HttpStatus.CREATED).json(new Response(true, "Đăng tải file thành công", data));
    } catch (error) {
        console.log(error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(new Response(false, "Đã xảy ra lỗi. Vui lòng thử lại"));
    }
}

const savePost = async (req, res) => {
    const formattedDate = moment().format("YYYY-MM-DD");

    const uploadDir = path.join(__dirname, '..', 'uploads', 'temp');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, req.file.filename);

    if (!fs.existsSync(filePath) || fs.lstatSync(filePath).isDirectory()) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(new Response(false, "Đã xảy ra lỗi. Vui lòng thử lại."));
    }
    try {
        const { error } = validationService.validateProjectId(req.query);
        if (error) {
            fs.unlinkSync(filePath);
            return res.status(HttpStatus.BAD_REQUEST).json(new Response(false, "Thông tin không hợp lệ"));
        }
        
        if (!req.file) {
            return res.status(HttpStatus.BAD_REQUEST).json(new Response(false, "File không được phép để trống"));
        }

        if (path.extname(req.file.filename) !== ".md" && path.extname(req.file.filename) !== ".html") {
            fs.unlinkSync(filePath);
            return res.status(HttpStatus.BAD_REQUEST).json(new Response(false, "Chỉ file .md và .html được cho phép"));
        }
 
        const formattedFileName = req.file.filename.substring(req.file.filename.indexOf('_') + 1, req.file.filename.length);
        if (path.basename(formattedFileName, ".md") !== "main" && path.basename(formattedFileName, ".html") !== "main") {
            fs.unlinkSync(filePath);
            return res.status(HttpStatus.BAD_REQUEST).json(new Response(false, "Tên file phải là main.md hoặc main.html"));
        }

        const resultGettingOneProject = await projectService.getProjectById(req.query.id);
        if (!resultGettingOneProject || resultGettingOneProject.length === 0) {
            fs.unlinkSync(filePath);
            return res.status(HttpStatus.NOT_FOUND).json(new Response(false, "Dự án không tồn tại"));
        }

        const responseCheckingExistProject = await axios.get(
            `http://localhost:3001/v1/files/check?path=general_website/project/${resultGettingOneProject[0].name}`,
            {
                validateStatus: function (status) {
                    return status >= 200 && status <= 500;
                }
            }
        );

        if (responseCheckingExistProject.status < 200 || responseCheckingExistProject.status > 299) {
            fs.unlinkSync(filePath);
            return res.status(responseCheckingExistProject.status).json(new Response(false, responseCheckingExistProject.data.message));
        }

        if (!responseCheckingExistProject.data.data.existed) {
            fs.unlinkSync(filePath);
            return res.status(HttpStatus.CONFLICT).json(new Response(false, "Dự án không tồn tại"));
        }

        await axios.delete(
            `http://localhost:3001/v1/files/delete?path=general_website/project/${resultGettingOneProject[0].name}/main.html`,
            {
                validateStatus: function (status) {
                    return status >= 200 && status <= 500;
                }
            }
        );

        await fileService.deleteFile({ project_id: req.query.id, file: formattedFileName});

        const fileStream = fs.createReadStream(filePath);
        const form = new FormData();
        form.append("file", fileStream, formattedFileName);

        let response;
        try {
            response = await axios.post(
                `http://localhost:3001/v1/files/upload?path=general_website/project/${resultGettingOneProject[0].name}&option=default`,
                form,
                {
                    headers: {
                        ...form.getHeaders(),
                    },
                    validateStatus: function (status) {
                        return status >= 200 && status <= 500;
                    }
                }
            );
        } catch (error) {
            fs.unlinkSync(filePath);
            return res.status(HttpStatus.CONFLICT).json(new Response(false, error));
        }

        if (response.status < 200 || response.status > 299) {
            fs.unlinkSync(filePath);
            return res.status(response.status).json(new Response(false, response.data.message));
        }

        const data = new Object({
            project_id: req.query.id,
            file: formattedFileName,
            date_created: formattedDate,
        });

        const resultSavingPost = await fileService.saveFile(data);
        if (!resultSavingPost || resultSavingPost.affectedRows === 0) {
            fs.unlinkSync(filePath);
            throw new Error("Error saving post");
        }

        fs.unlinkSync(filePath);

        return res.status(HttpStatus.CREATED).json(new Response(true, "Đăng bài viết thành công", data));
    } catch (error) {
        fs.unlinkSync(filePath);
        console.log(error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(new Response(false, "Đã xảy ra lỗi. Vui lòng thử lại."));
    }
}

const getProjects = async (req, res) => {
    try {
        const { error } = validationService.validateGettingPost(req.body);
        if (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(new Response(false, "Thông tin không hợp lệ"));
        }
        const resultGettingPosts = await projectService.getProjects(req.body); 
        return res.status(HttpStatus.OK).json(new Response(true, "Lấy dữ liệu thành công", resultGettingPosts));
    } catch (error) {
        console.log(error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(new Response(false, "Đã xảy ra lỗi. Vui lòng thử lại."));
    }
}

const getFile = async (req, res) => {
    try {
        const { error } = validationService.validateGettingFile(req.query);
        if (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(new Response(false, "Thông tin không hợp lệ"));
        }

        const resultGettingProject = await projectService.getProjectById(req.query.project_id);
        if (!resultGettingProject || resultGettingProject.length === 0) {
            return res.status(HttpStatus.NOT_FOUND).json(new Response(false, "Dự án không tồn tại"));
        }

        const responseCheckingExistProject = await axios.get(
            `http://localhost:3001/v1/files/check?path=general_website/project/${resultGettingProject[0].name}`,
            {
                validateStatus: function (status) {
                    return status >= 200 && status <= 500;
                }
            }
        );

        if (responseCheckingExistProject.status < 200 || responseCheckingExistProject.status > 299) {
            return res.status(responseCheckingExistProject.status).json(new Response(false, responseCheckingExistProject.data.message));
        }

        if (!responseCheckingExistProject.data.data.existed) {
            return res.status(HttpStatus.CONFLICT).json(new Response(false, "Dự án không tồn tại"));
        }

        let response;
        try {
            response = await axios.get(`http://localhost:3001/v1/files?path=general_website/project/${resultGettingProject[0].name}/${req.query.file}&option=default`, {
                responseType: 'stream'
            });
        } catch (error) {
            console.log(error);
            if (error.response.status == 404) {
                return res.status(HttpStatus.NOT_FOUND).json(new Response(false, "File không tồn tại"));
            }
            else {
                return res.status(error.response.status).json(new Response(false, "Đã xảy ra lỗi. Vui lòng thử lại"));
            }
        }

        res.setHeader('Content-Disposition', `attachment; filename="${req.query.file}"`);
        res.setHeader('Content-Type', response.headers['content-type']);

        response.data.pipe(res);
    } catch (error) {
        console.error(error);
        res.status(500).json(new Response(false, "Đã xảy ra lỗi. Vui lòng thử lại"));
    }
};

const deleteProject = async (req, res) => {
    try {
        const { error } = validationService.validateProjectId(req.query);
        if (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(new Response(false, "Thông tin không hợp lệ"));
        }

        const resultGettingProject = await projectService.getProjectById(req.query.id);
        if (!resultGettingProject || resultGettingProject.length === 0) {
            return res.status(HttpStatus.NOT_FOUND).json(new Response(false, "Dự án không tồn tại"));
        }

        await axios.delete(
        `http://localhost:3001/v1/files/delete?path=general_website/project/${resultGettingProject[0].name}`,
        {
            validateStatus: function (status) {
                return status >= 200 && status <= 500;
            }
        });

        await projectService.deleteProject(req.query.id);
        return res.status(HttpStatus.OK).json(new Response(true, "Xoá dự án thành công"));
    } catch (error) {
        console.log(error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(new Response(false, "Đã xảy ra lỗi. Vui lòng thử lại"));
    }
}

const deleteFile = async (req, res) => {
    try {
        const { error } = validationService.validateGettingFile(req.query);
        if (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(new Response(false, "Thông tin không hợp lệ"));
        }

        const resultGettingProject = await projectService.getProjectById(req.query.project_id);
        if (!resultGettingProject || resultGettingProject.length === 0) {
            return res.status(HttpStatus.NOT_FOUND).json(new Response(false, "Dự án không tồn tại"));
        }

        const responseCheckingExistProject = await axios.get(
            `http://localhost:3001/v1/files/check?path=general_website/project/${resultGettingProject[0].name}`,
            {
                validateStatus: function (status) {
                    return status >= 200 && status <= 500;
                }
            }
        );

        if (responseCheckingExistProject.status < 200 || responseCheckingExistProject.status > 299) {
            return res.status(responseCheckingExistProject.status).json(new Response(false, responseCheckingExistProject.data.message));
        }

        if (!responseCheckingExistProject.data.data.existed) {
            return res.status(HttpStatus.CONFLICT).json(new Response(false, "Dự án không tồn tại"));
        }

        const responseDeleteFile = await axios.delete(
            `http://localhost:3001/v1/files/delete?path=general_website/project/${resultGettingProject[0].name}/${req.query.file}`,
            {
                validateStatus: function (status) {
                    return status >= 200 && status <= 500;
                }
            }
        );

        if (responseDeleteFile.status < 200 || responseDeleteFile.status > 299) {
            return res.status(responseDeleteFile.status).json(new Response(false, responseDeleteFile.data.message));
        }
     
        res.status(HttpStatus.OK).json(new Response(true, "Xóa file thành công"));
        
    } catch (error) {
        console.error(error);
        res.status(500).json(new Response(false, "Đã xảy ra lỗi. Vui lòng thử lại"));
    }
};

const saveImgDescription = async (req, res) => {
    const formattedDate = moment().format("YYYY-MM-DD");

    const uploadDir = path.join(__dirname, '..', 'uploads', 'temp');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, req.file.filename);

    if (!fs.existsSync(filePath) || fs.lstatSync(filePath).isDirectory()) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(new Response(false, "Đã xảy ra lỗi. Vui lòng thử lại."));
    }
    try {
        const { error } = validationService.validateProjectId(req.query);
        if (error) {
            fs.unlinkSync(filePath);
            return res.status(HttpStatus.BAD_REQUEST).json(new Response(false, "Thông tin không hợp lệ"));
        }
        
        if (!req.file) {
            return res.status(HttpStatus.BAD_REQUEST).json(new Response(false, "File không được phép để trống"));
        }

        if (req.file.mimetype !== 'image/jpeg' && req.file.mimetype !== 'image/gif' && req.file.mimetype !== 'image/png')
        {
            fs.unlinkSync(filePath);
            return res.status(HttpStatus.FORBIDDEN).json(new Response(false, "Chỉ đăng tải hình ảnh"));
        }

        const resultGettingOneProject = await projectService.getProjectById(req.query.id);
        if (!resultGettingOneProject || resultGettingOneProject.length === 0) {
            fs.unlinkSync(filePath);
            return res.status(HttpStatus.NOT_FOUND).json(new Response(false, "Dự án không tồn tại"));
        }

        const responseCheckingExistProject = await axios.get(
            `http://localhost:3001/v1/files/check?path=general_website/project/${resultGettingOneProject[0].name}`,
            {
                validateStatus: function (status) {
                    return status >= 200 && status <= 500;
                }
            }
        );

        if (responseCheckingExistProject.status < 200 || responseCheckingExistProject.status > 299) {
            fs.unlinkSync(filePath);
            return res.status(responseCheckingExistProject.status).json(new Response(false, responseCheckingExistProject.data.message));
        }

        if (!responseCheckingExistProject.data.data.existed) {
            fs.unlinkSync(filePath);
            return res.status(HttpStatus.CONFLICT).json(new Response(false, "Dự án không tồn tại"));
        }

        await axios.delete(
            `http://localhost:3001/v1/files/delete?path=general_website/project/${resultGettingOneProject[0].name}/default.png`,
            {
                validateStatus: function (status) {
                    return status >= 200 && status <= 500;
                }
            }
        );

        await fileService.deleteFile({ project_id: req.query.id, file: "default.png"});

        const fileStream = fs.createReadStream(filePath);
        const form = new FormData();
        form.append("file", fileStream, "default.png");

        let response;
        try {
            response = await axios.post(
                `http://localhost:3001/v1/files/upload?path=general_website/project/${resultGettingOneProject[0].name}&option=default`,
                form,
                {
                    headers: {
                        ...form.getHeaders(),
                    },
                    validateStatus: function (status) {
                        return status >= 200 && status <= 500;
                    }
                }
            );
        } catch (error) {
            fs.unlinkSync(filePath);
            return res.status(HttpStatus.CONFLICT).json(new Response(false, error));
        }

        if (response.status < 200 || response.status > 299) {
            fs.unlinkSync(filePath);
            return res.status(response.status).json(new Response(false, response.data.message));
        }

        const data = new Object({
            project_id: req.query.id,
            file: "default.png",
            date_created: formattedDate,
        });

        const resultSavingPost = await fileService.saveFile(data);
        if (!resultSavingPost || resultSavingPost.affectedRows === 0) {
            fs.unlinkSync(filePath);
            throw new Error("Error saving post");
        }

        fs.unlinkSync(filePath);

        return res.status(HttpStatus.CREATED).json(new Response(true, "Đăng tải file thành công", data));
    } catch (error) {
        fs.unlinkSync(filePath);
        console.log(error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(new Response(false, "Đã xảy ra lỗi. Vui lòng thử lại."));
    }
}

const logout = (req, res) => {
	try {
		req.logout(() => {
			req.session.destroy();
		});

		return res.status(HttpStatus.OK).json(new Response(true, "Đăng xuất thành công"));
        
	} catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(new Response(false, "Đã xảy ra lỗi. Vui lòng thử lại."));
	}
} 


module.exports = {
    createNewProject,
    uploadFileBelongToProject,
    savePost,
    getFile,
    getProjects,
    deleteProject,
    deleteFile,
    saveImgDescription,
    logout
}