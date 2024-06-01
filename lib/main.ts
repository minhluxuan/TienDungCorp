import axios, { AxiosResponse } from "axios";
const FormData = require("form-data");

export interface CreatingProject {
    name: String,
    title: String,
    author: String,
    type: Number,

}

export interface UploadingFileInfo {
    project_id: String,
    file: File
}

export interface GettingPostCriteria {
    id: String,
    author: String,
    title: String,
    yearEnd: Number,
    yearStart: Number,
    name: String,
}

export interface GettingFileCriteria {
    project_id: String,
    fileName: String,
}

export interface conditionQueryProject {
    project_id: String,
}


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

// File must be archived first (.zip type), it's not allowed to receive other file types 
export async function createProject (creatProjectInfo: CreatingProject) {
    try {
        const response: AxiosResponse = await axios.post("http://localhost:3000/v1/media/project/create", creatProjectInfo,
            {
                withCredentials: true,
            }
        );

        return { error: response.data.success, message: response.data.message};
    } catch (error: any) {
        console.error('Error uploading post:', error?.response?.data);
        console.error("Request that caused the error: ", error?.request);
        return { error: error?.response?.data, request: error?.request, status: error.response ? error.response.status : null }; // Ném lỗi để xử lý bên ngoài
    }
}

export async function getProjects(criteria?: GettingPostCriteria) {
    try {
        const response: AxiosResponse = await axios.post("http://localhost:3000/v1/media/project/get", criteria || {}, {
            withCredentials: true,
        });
        return { error: response.data.success, message: response.data.message, data: response.data.data };
    } catch (error: any) {
        console.error('Error getting posts:', error?.response?.data);
        console.error("Request that caused the error: ", error?.request);
        return { error: error?.response?.data, request: error?.request, status: error.response ? error.response.status : null }; // Ném lỗi để xử lý bên ngoài
    }
}

export async function uploadFileBelongToProject(postPayload: UploadingFileInfo) {
    try {
        const formData = new FormData();

        formData.append('file', postPayload.file);

        const response: AxiosResponse = await axios.post(`http://localhost:3000/v1/media/project/file?project_id=${postPayload.project_id}`, formData,
            {
                withCredentials: true,
            }
        );
        return { error: response.data.success, message: response.data.message, data: response.data.data };
    } catch (error: any) {
        console.error('Error uploading post:', error?.response?.data);
        console.error("Request that caused the error: ", error?.request);
        return { error: error?.response?.data, request: error?.request, status: error.response ? error.response.status : null }; // Ném lỗi để xử lý bên ngoài
    }
}

export async function savePost(postPayload: UploadingFileInfo) {
    try {
        const formData = new FormData();

        formData.append('file', postPayload.file);

        const response: AxiosResponse = await axios.post(`http://localhost:3000/v1/media/project/post?project_id=${postPayload.project_id}`, formData,
            {
                withCredentials: true,
            }
        );
        return { error: response.data.success, message: response.data.message, data: response.data.data };
    } catch (error: any) {
        console.error('Error uploading post:', error?.response?.data);
        console.error("Request that caused the error: ", error?.request);
        return { error: error?.response?.data, request: error?.request, status: error.response ? error.response.status : null }; // Ném lỗi để xử lý bên ngoài
    }
}

export async function getFile(criteria: GettingFileCriteria) {
    try {
        const response: AxiosResponse = await axios.get(`http://localhost:3000/v1/media/project/file?project_id=${criteria.project_id}&file=${criteria.fileName}`, {
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

export async function deleteProject(condition: conditionQueryProject) {
    try {
        const response: AxiosResponse = await axios.delete(`http://localhost:3000/v1/media/project?project_id=${condition.project_id}`,{
            withCredentials: true
        });
        return { error: response.data.success, message: response.data.message, data: response.data.data };
    } catch (error: any) {
        console.error('Error getting posts:', error?.response?.data);
        console.error("Request that caused the error: ", error?.request);
        return { error: error?.response?.data, request: error?.request, status: error.response ? error.response.status : null }; // Ném lỗi để xử lý bên ngoài
    }
}



