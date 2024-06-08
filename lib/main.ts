import axios, { AxiosResponse } from "axios";
const FormData = require("form-data");

export interface CreatingProject {
    name: String,
    title: String,
    author: String,
    type: Number,
    description: String
}

export interface UploadingFileInfo {
    project_id: String,
    file: File
}

export interface GettingPostCriteria {
    id?: String,
    author?: String,
    title?: String,
    yearEnd?: Number,
    yearStart?: Number,
    name?: String,
    type?: Number,
}

export interface GettingFileCriteria {
    project_id: String,
    file: String,
}

export interface conditionQueryProject {
    project_id: String,
}


export async function getSession() {
    try {
        const response: AxiosResponse = await axios.get("http://localhost:3000/get_session", {
            withCredentials: true,
        });

        return { error: response.data.error, message: response.data.message, data: response.data.data };
    } catch (error: any) {
        console.error('Error uploading post:', error?.response?.data);
        console.error("Request that caused the error: ", error?.request);
        return { error: error?.response?.data, request: error?.request, status: error.response ? error.response.status : null }; // Ném lỗi để xử lý bên ngoài
    }
}

// đăng nhập
export async function login(username: string, password: string) {
    try {
        const response: AxiosResponse = await axios.post("http://localhost:3000/v1/media/login", {
            username: username,
            password: password,
        }, {
            withCredentials: true,
        });

        return { error: response.data.error, message: response.data.message, valid: response.data.valid };
    } catch (error: any) {
        console.error('Error uploading post:', error?.response?.data);
        console.error("Request that caused the error: ", error?.request);
        return { error: error?.response?.data, request: error?.request, status: error.response ? error.response.status : null }; // Ném lỗi để xử lý bên ngoài
    }
}

//đăng xuất
export async function logout () {
    try {
        const response: AxiosResponse = await axios.get("http://localhost:3000/v1/media/logout",
            {
                withCredentials: true,
            }
        );

        return { success: response.data.success, message: response.data.message};
    } catch (error: any) {
        console.error('Error uploading post:', error?.response?.data);
        console.error("Request that caused the error: ", error?.request);
        return { error: error?.response?.data, request: error?.request, status: error.response ? error.response.status : null }; // Ném lỗi để xử lý bên ngoài
    }
}

// Tạo project 
export async function createProject (creatProjectInfo: CreatingProject) {
    try {
        const response: AxiosResponse = await axios.post("http://localhost:3000/v1/media/project/create", creatProjectInfo,
            {
                withCredentials: true,
            }
        );

        return { success: response.data.success, message: response.data.message, data: response.data.data };
    } catch (error: any) {
        console.error('Error uploading post:', error?.response?.data);
        console.error("Request that caused the error: ", error?.request);
        return { error: error?.response?.data, request: error?.request, status: error.response ? error.response.status : null }; // Ném lỗi để xử lý bên ngoài
    }
}

// lấy thông tin project đã tạo
export async function getProjects(criteria?: GettingPostCriteria) {
    try {
        const response: AxiosResponse = await axios.post("http://localhost:3000/v1/media/project/get", criteria || {}, {
            withCredentials: true,
        });
        return { success: response.data.success, message: response.data.message, data: response.data.data };
    } catch (error: any) {
        console.error('Error getting posts:', error?.response?.data);
        console.error("Request that caused the error: ", error?.request);
        return { error: error?.response?.data, request: error?.request, status: error.response ? error.response.status : null }; // Ném lỗi để xử lý bên ngoài
    }
}

// upload những file liên quan đến project giống như latex
export async function uploadFileBelongToProject(postPayload: UploadingFileInfo) {
    try {
        const formData = new FormData();

        formData.append('file', postPayload.file);

        const response: AxiosResponse = await axios.post(`http://localhost:3000/v1/media/project/file?id=${postPayload.project_id}`, formData,
            {
                withCredentials: true,
            }
        );
        return { success: response.data.success, message: response.data.message, data: response.data.data };
    } catch (error: any) {
        console.error('Error uploading post:', error?.response?.data);
        console.error("Request that caused the error: ", error?.request);
        return { error: error?.response?.data, request: error?.request, status: error.response ? error.response.status : null }; // Ném lỗi để xử lý bên ngoài
    }
}

//lưu bài viết
export async function savePost(postPayload: UploadingFileInfo) {
    try {
        const formData = new FormData();

        formData.append('file', postPayload.file);

        const response: AxiosResponse = await axios.post(`http://localhost:3000/v1/media/project/post?id=${postPayload.project_id}`, formData,
            {
                withCredentials: true,
            }
        );
        return { success: response.data.success, message: response.data.message, data: response.data.data };
    } catch (error: any) {
        console.error('Error uploading post:', error?.response?.data);
        console.error("Request that caused the error: ", error?.request);
        return { error: error?.response?.data, request: error?.request, status: error.response ? error.response.status : null }; // Ném lỗi để xử lý bên ngoài
    }
}

//lấy file 
export async function getFile(criteria: GettingFileCriteria) {
    try {
        const response: AxiosResponse = await axios.get(`http://localhost:3000/v1/media/project/file?project_id=${criteria.project_id}&file=${criteria.file}`, {
            withCredentials: true,
            responseType: 'arraybuffer',
        });

        const blob = new Blob([response.data], { type: response.headers['content-type'] });
        const imgUrl = URL.createObjectURL(blob);

        return { data: imgUrl}

    } catch (error: any) {
        console.error('Error getting file:', error?.response?.data);
        console.error("Request that caused the error: ", error?.request);
        return { error: error?.response?.data, request: error?.request, status: error.response ? error.response.status : null }; // Ném lỗi để xử lý bên ngoài
    }
}

// xóa project bằng project_id
export async function deleteProject(condition: conditionQueryProject) {
    try {
        const response: AxiosResponse = await axios.delete(`http://localhost:3000/v1/media/project?id=${condition.project_id}`,{
            withCredentials: true
        });
        return { success: response.data.success, message: response.data.message};
    } catch (error: any) {
        console.error('Error getting posts:', error?.response?.data);
        console.error("Request that caused the error: ", error?.request);
        return { error: error?.response?.data, request: error?.request, status: error.response ? error.response.status : null }; // Ném lỗi để xử lý bên ngoài
    }
}

//Xóa file 
export async function deleteFile(criteria: GettingFileCriteria) {
    try {
        const response: AxiosResponse = await axios.delete(`http://localhost:3000/v1/media/project/file?project_id=${criteria.project_id}&file=${criteria.file}`, {
            withCredentials: true,
        });

       
        return { success: response.data.success, message: response.data.message};

    } catch (error: any) {
        console.error('Error getting file:', error?.response?.data);
        console.error("Request that caused the error: ", error?.request);
        return { error: error?.response?.data, request: error?.request, status: error.response ? error.response.status : null }; // Ném lỗi để xử lý bên ngoài
    }
}

//lưu hình ảnh mô tả
export async function saveImgDescription(postPayload: UploadingFileInfo) {
    try {
        const formData = new FormData();

        formData.append('file', postPayload.file);

        const response: AxiosResponse = await axios.post(`http://localhost:3000/v1/media/project/post_default?id=${postPayload.project_id}`, formData,
            {
                withCredentials: true,
            }
        );
        return { success: response.data.success, message: response.data.message, data: response.data.data };
    } catch (error: any) {
        console.error('Error uploading post:', error?.response?.data);
        console.error("Request that caused the error: ", error?.request);
        return { error: error?.response?.data, request: error?.request, status: error.response ? error.response.status : null }; // Ném lỗi để xử lý bên ngoài
    }
}