import axios, { AxiosResponse } from "axios";
const FormData = require("form-data");
import * as JSZip from 'jszip';

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
    monthCreated: Number,
    yearCreated: Number,
}

export interface GettingFileCriteria {
    id: String,
}

// File must be archived first (.zip type), it's not allowed to receive other file types 
export async function uploadPost(postPayload: UploadingPostPayload) {
    try {
        const formData = new FormData();
        formData.append('title', postPayload.title);
        formData.append('author', postPayload.author);
        formData.append('file', postPayload.file);

        const response: AxiosResponse = await axios.post("http://localhost:3000/v1/media/upload", formData);

        return { error: response.data.error, message: response.data.message, data: response.data.data };
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
            responseType: 'arraybuffer',
        });

        const zipFile = await JSZip.loadAsync(response.data);
        const imageUrls: string[] = [];

        await Promise.all(
            Object.keys(zipFile.files).map(async (filename) => {
                const file = zipFile.files[filename];
                const blob = await file.async('blob');
                const url = URL.createObjectURL(blob);
                imageUrls.push(url);
            })
        );

        return imageUrls;
    } catch (error: any) {
        console.error('Error getting file:', error?.response?.data);
        console.error("Request that caused the error: ", error?.request);
        return { error: error?.response?.data, request: error?.request, status: error.response ? error.response.status : null }; // Ném lỗi để xử lý bên ngoài
    }
}

export async function getPosts(criteria?: GettingPostCriteria) {
    try {
        const response: AxiosResponse = await axios.post("http://localhost:3000/v1/media/post", criteria || {});
        return { error: response.data.error, message: response.data.message, data: response.data.data };
    } catch (error: any) {
        console.error('Error getting posts:', error?.response?.data);
        console.error("Request that caused the error: ", error?.request);
        return { error: error?.response?.data, request: error?.request, status: error.response ? error.response.status : null }; // Ném lỗi để xử lý bên ngoài
    }
}





