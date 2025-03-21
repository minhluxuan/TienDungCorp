"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Storage = exports.Project = exports.Auth = void 0;
const axios_1 = __importDefault(require("axios"));
const http_status_codes_1 = require("http-status-codes");
class Auth {
    static async login(payload, accessToken) {
        try {
            const response = await axios_1.default.post(`${this.baseUrl}/login`, payload, {
                withCredentials: true,
                validateStatus: status => status >= 200 && status <= 500,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            if (!response) {
                const responseData = {
                    success: false,
                    message: 'An error occurs. Please try again.',
                    data: null,
                    status: http_status_codes_1.StatusCodes.BAD_GATEWAY
                };
                return responseData;
            }
            const data = response.data;
            const responseData = {
                success: data.success,
                message: data.message,
                data: data.data,
                status: response.status
            };
            return responseData;
        }
        catch (error) {
            console.error("Request that caused the error: ", error?.request);
            return { success: error?.response?.data, request: error?.request, status: error.response ? error.response.status : null };
        }
    }
    static async getUserInfo(accessToken) {
        try {
            const response = await axios_1.default.get(`${this.baseUrl}`, {
                withCredentials: true,
                validateStatus: status => status >= 200 && status <= 500,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            if (!response) {
                const responseData = {
                    success: false,
                    message: 'An error occurs. Please try again.',
                    data: null,
                    status: http_status_codes_1.StatusCodes.BAD_GATEWAY
                };
                return responseData;
            }
            const data = response.data;
            const responseData = {
                success: data.success,
                message: data.message,
                data: data.data,
                status: response.status
            };
            return responseData;
        }
        catch (error) {
            console.error("Request that caused the error: ", error?.request);
            return { success: error?.response?.data, request: error?.request, status: error.response ? error.response.status : null };
        }
    }
}
exports.Auth = Auth;
Auth.baseUrl = 'https://api.tiendungcorp.com/v1/auth';
class Project {
    static async create(payload, accessToken) {
        try {
            const response = await axios_1.default.post(`${this.baseUrl}/create`, payload, {
                withCredentials: true,
                validateStatus: status => status >= 200 && status <= 500,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            if (!response) {
                const responseData = {
                    success: false,
                    message: 'An error occurs. Please try again.',
                    data: null,
                    status: http_status_codes_1.StatusCodes.BAD_GATEWAY
                };
                return responseData;
            }
            const data = response.data;
            const responseData = {
                success: data.success,
                message: data.message,
                data: data.data,
                status: response.status
            };
            return responseData;
        }
        catch (error) {
            console.error("Request that caused the error: ", error?.request);
            return { success: error?.response?.data, request: error?.request, status: error.response ? error.response.status : null };
        }
    }
    static async search(payload, accessToken) {
        try {
            const response = await axios_1.default.post(`${this.baseUrl}/search`, payload, {
                withCredentials: true,
                validateStatus: status => status >= 200 && status <= 500,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            if (!response) {
                const responseData = {
                    success: false,
                    message: 'An error occurs. Please try again.',
                    data: null,
                    status: http_status_codes_1.StatusCodes.BAD_GATEWAY
                };
                return responseData;
            }
            const data = response.data;
            const responseData = {
                success: data.success,
                message: data.message,
                data: data.data,
                status: response.status
            };
            return responseData;
        }
        catch (error) {
            console.error("Request that caused the error: ", error?.request);
            return { success: error?.response?.data, request: error?.request, status: error.response ? error.response.status : null };
        }
    }
    static async searchById(id, accessToken) {
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/search/${id}`, {
                withCredentials: true,
                validateStatus: status => status >= 200 && status <= 500,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            if (!response) {
                const responseData = {
                    success: false,
                    message: 'An error occurs. Please try again.',
                    data: null,
                    status: http_status_codes_1.StatusCodes.BAD_GATEWAY
                };
                return responseData;
            }
            const data = response.data;
            const responseData = {
                success: data.success,
                message: data.message,
                data: data.data,
                status: response.status
            };
            return responseData;
        }
        catch (error) {
            console.error("Request that caused the error: ", error?.request);
            return { success: error?.response?.data, request: error?.request, status: error.response ? error.response.status : null };
        }
    }
    static async updateContent(id, payload, accessToken) {
        try {
            const response = await axios_1.default.put(`${this.baseUrl}/content/update/${id}`, payload, {
                withCredentials: true,
                validateStatus: status => status >= 200 && status <= 500,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            if (!response) {
                const responseData = {
                    success: false,
                    message: 'An error occurs. Please try again.',
                    data: null,
                    status: http_status_codes_1.StatusCodes.BAD_GATEWAY
                };
                return responseData;
            }
            const data = response.data;
            const responseData = {
                success: data.success,
                message: data.message,
                data: data.data,
                status: response.status
            };
            return responseData;
        }
        catch (error) {
            console.error("Request that caused the error: ", error?.request);
            return { success: error?.response?.data, request: error?.request, status: error.response ? error.response.status : null };
        }
    }
    static async update(id, payload, accessToken) {
        try {
            const response = await axios_1.default.put(`${this.baseUrl}/update/${id}`, payload, {
                withCredentials: true,
                validateStatus: status => status >= 200 && status <= 500,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            if (!response) {
                const responseData = {
                    success: false,
                    message: 'An error occurs. Please try again.',
                    data: null,
                    status: http_status_codes_1.StatusCodes.BAD_GATEWAY
                };
                return responseData;
            }
            const data = response.data;
            const responseData = {
                success: data.success,
                message: data.message,
                data: data.data,
                status: response.status
            };
            return responseData;
        }
        catch (error) {
            console.error("Request that caused the error: ", error?.request);
            return { success: error?.response?.data, request: error?.request, status: error.response ? error.response.status : null };
        }
    }
    static async destroy(id, accessToken) {
        try {
            const response = await axios_1.default.delete(`${this.baseUrl}/update/${id}`, {
                withCredentials: true,
                validateStatus: status => status >= 200 && status <= 500,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            if (!response) {
                const responseData = {
                    success: false,
                    message: 'An error occurs. Please try again.',
                    data: null,
                    status: http_status_codes_1.StatusCodes.BAD_GATEWAY
                };
                return responseData;
            }
            const data = response.data;
            const responseData = {
                success: data.success,
                message: data.message,
                data: data.data,
                status: response.status
            };
            return responseData;
        }
        catch (error) {
            console.error("Request that caused the error: ", error?.request);
            return { success: error?.response?.data, request: error?.request, status: error.response ? error.response.status : null };
        }
    }
}
exports.Project = Project;
Project.baseUrl = 'https://api.tiendungcorp.com/v1/project';
class Storage {
    static async upload(payload, accessToken) {
        const formData = new FormData();
        for (const file in payload.files) {
            formData.append('files', file);
        }
        formData.append('projectId', payload.projectId);
        try {
            const response = await axios_1.default.post(`${this.baseUrl}/upload`, formData, {
                withCredentials: true,
                validateStatus: status => status >= 200 && status <= 500,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            if (!response) {
                const responseData = {
                    success: false,
                    message: 'An error occurs. Please try again.',
                    data: null,
                    status: http_status_codes_1.StatusCodes.BAD_GATEWAY
                };
                return responseData;
            }
            const data = response.data;
            const responseData = {
                success: data.success,
                message: data.message,
                data: data.data,
                status: response.status
            };
            return responseData;
        }
        catch (error) {
            console.error("Request that caused the error: ", error?.request);
            return { success: error?.response?.data, request: error?.request, status: error.response ? error.response.status : null };
        }
    }
    static async download(path, accessToken) {
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/download?path=${path}`, {
                withCredentials: true,
                validateStatus: status => status >= 200 && status <= 500,
                responseType: 'blob',
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            if (!response) {
                const responseData = {
                    success: false,
                    message: 'An error occurs. Please try again.',
                    data: null,
                    status: http_status_codes_1.StatusCodes.BAD_GATEWAY
                };
                return responseData;
            }
            const data = response.data;
            const responseData = {
                success: data.success,
                message: data.message,
                data: data.data,
                status: response.status
            };
            return responseData;
        }
        catch (error) {
            console.error("Request that caused the error: ", error?.request);
            return { success: error?.response?.data, request: error?.request, status: error.response ? error.response.status : null };
        }
    }
    static async destroy(id, accessToken) {
        try {
            const response = await axios_1.default.delete(`${this.baseUrl}/delete/${id}`, {
                withCredentials: true,
                validateStatus: status => status >= 200 && status <= 500,
                responseType: 'blob',
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            if (!response) {
                const responseData = {
                    success: false,
                    message: 'An error occurs. Please try again.',
                    data: null,
                    status: http_status_codes_1.StatusCodes.BAD_GATEWAY
                };
                return responseData;
            }
            const data = response.data;
            return data; // blob
        }
        catch (error) {
            console.error("Request that caused the error: ", error?.request);
            return { success: error?.response?.data, request: error?.request, status: error.response ? error.response.status : null };
        }
    }
}
exports.Storage = Storage;
Storage.baseUrl = 'http://localhost:3000/v1/file';
