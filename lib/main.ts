import axios, { AxiosResponse } from "axios";
import { error } from "console";
const FormData = require("form-data");
import * as JSZip from 'jszip';
import path from "path";

export interface UploadingPostPayload {
    title: String,
    author: String,
    type: Number,
    file: File
}

export interface UploadingFilePayload {
    file: File
}

export interface GettingPostCriteria {
    id: String,
    author: String,
    title: String,
    yearEnd: Number,
    yearStart: Number,
}

export interface GettingFileCriteria {
    id: String,
}

export interface uploadImg {
    file: File
}

export interface GettingFileImg {
    path: string
}

export async function login(username: string, password: string) {
    try {
        const response: AxiosResponse = await axios.post("http://localhost:3000/v1/staff/login", {
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
export async function uploadPost(postPayload: UploadingPostPayload) {
    try {
        const formData = new FormData();
        formData.append('title', postPayload.title);
        formData.append('author', postPayload.author);
        formData.append('file', postPayload.file);

        const response: AxiosResponse = await axios.post("http://localhost:3000/v1/media/upload", formData);

        return { error: response.data.success, message: response.data.message, data: response.data.data };
    } catch (error: any) {
        console.error('Error uploading post:', error?.response?.data);
        console.error("Request that caused the error: ", error?.request);
        return { error: error?.response?.data, request: error?.request, status: error.response ? error.response.status : null }; // Ném lỗi để xử lý bên ngoài
    }
}

// Response will be zipped file
export async function getFile(criteria: GettingFileCriteria) {
    try {
        const response: AxiosResponse = await axios.get(`http://localhost:3000/v1/media/file?id=${criteria.id}`, {
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

export async function getPosts(criteria?: GettingPostCriteria) {
    try {
        const response: AxiosResponse = await axios.post("http://localhost:3000/v1/media/post", criteria || {});
        return { error: response.data.success, message: response.data.message, data: response.data.data };
    } catch (error: any) {
        console.error('Error getting posts:', error?.response?.data);
        console.error("Request that caused the error: ", error?.request);
        return { error: error?.response?.data, request: error?.request, status: error.response ? error.response.status : null }; // Ném lỗi để xử lý bên ngoài
    }
}

export async function uploadImg(postPayload: uploadImg) {
    try {
        const formData = new FormData();

        formData.append('file', postPayload.file);

        const response: AxiosResponse = await axios.post("http://localhost:3000/v1/media/uploadImg", formData);

        return { error: response.data.success, message: response.data.message, data: response.data.data };
    } catch (error: any) {
        console.error('Error uploading post:', error?.response?.data);
        console.error("Request that caused the error: ", error?.request);
        return { error: error?.response?.data, request: error?.request, status: error.response ? error.response.status : null }; // Ném lỗi để xử lý bên ngoài
    }
}

export async function getImg(pathFile: GettingFileImg) {
    try {
        const response: AxiosResponse = await axios.get(`http://localhost:3000/v1/media/getImg?path=${pathFile.path}`, {
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


