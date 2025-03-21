import { CreateProjectInterface, LoginPayloadInterface, ResponseData, ResponseDataCreatingProjectInterface, ResponseDataGettingUserInfoInterface, ResponseDataLoggingInInterface, ResponseDataSearchingProjectInterface, ResponseDataUpdatingProjectInterface, ResponseDataUploadingFileInterface, SearchPayload, UpdateProjectContentInterface, UpdateProjectInterface, UploadFileInterface } from "./interface";
import axios from "axios";
import { StatusCodes as HttpStatusCode } from "http-status-codes";

export class Auth {
    static baseUrl: string = 'https://api.tiendungcorp.com/v1/auth';

    static async login(payload: LoginPayloadInterface, accessToken: string) {
        try {
            const response = await axios.post(`${this.baseUrl}/login`, payload, {
                withCredentials: true,
                validateStatus: status => status >= 200 && status <= 500,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            if (!response) {
                const responseData: ResponseData<any> = {
                    success: false,
                    message: 'An error occurs. Please try again.',
                    data: null,
                    status: HttpStatusCode.BAD_GATEWAY
                }

                return responseData;
            }

            const data: any = response.data;

            const responseData: ResponseData<ResponseDataLoggingInInterface> = {
                success: data.success,
                message: data.message,
                data: data.data,
                status: response.status
            }

            return responseData;
        } catch (error) {
            console.error("Request that caused the error: ", error?.request);
            return { success: error?.response?.data, request: error?.request, status: error.response ? error.response.status : null };
        }
    }

    static async getUserInfo(accessToken: string) {
        try {
            const response = await axios.get(`${this.baseUrl}`, {
                withCredentials: true,
                validateStatus: status => status >= 200 && status <= 500,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            if (!response) {
                const responseData: ResponseData<any> = {
                    success: false,
                    message: 'An error occurs. Please try again.',
                    data: null,
                    status: HttpStatusCode.BAD_GATEWAY
                }

                return responseData;
            }

            const data: any = response.data;

            const responseData: ResponseData<ResponseDataGettingUserInfoInterface> = {
                success: data.success,
                message: data.message,
                data: data.data,
                status: response.status
            }

            return responseData;
        } catch (error) {
            console.error("Request that caused the error: ", error?.request);
            return { success: error?.response?.data, request: error?.request, status: error.response ? error.response.status : null };
        }
    }
}

export class Project {
    static baseUrl: string = 'https://api.tiendungcorp.com/v1/project';
    
    static async create(payload: CreateProjectInterface, accessToken: string) {
        try {
            const response = await axios.post(`${this.baseUrl}/create`, payload, {
                withCredentials: true,
                validateStatus: status => status >= 200 && status <= 500,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            if (!response) {
                const responseData: ResponseData<any> = {
                    success: false,
                    message: 'An error occurs. Please try again.',
                    data: null,
                    status: HttpStatusCode.BAD_GATEWAY
                }

                return responseData;
            }

            const data: any = response.data;

            const responseData: ResponseData<ResponseDataCreatingProjectInterface> = {
                success: data.success,
                message: data.message,
                data: data.data,
                status: response.status
            }

            return responseData;
        } catch (error) {
            console.error("Request that caused the error: ", error?.request);
            return { success: error?.response?.data, request: error?.request, status: error.response ? error.response.status : null };
        }
    }

    static async search(payload: SearchPayload, accessToken: string) {
        try {
            const response = await axios.post(`${this.baseUrl}/search`, payload, {
                withCredentials: true,
                validateStatus: status => status >= 200 && status <= 500,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            if (!response) {
                const responseData: ResponseData<any> = {
                    success: false,
                    message: 'An error occurs. Please try again.',
                    data: null,
                    status: HttpStatusCode.BAD_GATEWAY
                }

                return responseData;
            }

            const data: any = response.data;

            const responseData: ResponseData<ResponseDataSearchingProjectInterface[]> = {
                success: data.success,
                message: data.message,
                data: data.data,
                status: response.status
            }

            return responseData;
        } catch (error) {
            console.error("Request that caused the error: ", error?.request);
            return { success: error?.response?.data, request: error?.request, status: error.response ? error.response.status : null };
        }
    }

    static async searchById(id: string, accessToken: string) {
        try {
            const response = await axios.get(`${this.baseUrl}/search/${id}`, {
                withCredentials: true,
                validateStatus: status => status >= 200 && status <= 500,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            if (!response) {
                const responseData: ResponseData<any> = {
                    success: false,
                    message: 'An error occurs. Please try again.',
                    data: null,
                    status: HttpStatusCode.BAD_GATEWAY
                }

                return responseData;
            }

            const data: any = response.data;

            const responseData: ResponseData<ResponseDataSearchingProjectInterface> = {
                success: data.success,
                message: data.message,
                data: data.data,
                status: response.status
            }

            return responseData;
        } catch (error) {
            console.error("Request that caused the error: ", error?.request);
            return { success: error?.response?.data, request: error?.request, status: error.response ? error.response.status : null };
        }
    }

    static async updateContent(id: string, payload: UpdateProjectContentInterface, accessToken: string) {
        try {
            const response = await axios.put(`${this.baseUrl}/content/update/${id}`, payload, {
                withCredentials: true,
                validateStatus: status => status >= 200 && status <= 500,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            if (!response) {
                const responseData: ResponseData<any> = {
                    success: false,
                    message: 'An error occurs. Please try again.',
                    data: null,
                    status: HttpStatusCode.BAD_GATEWAY
                }

                return responseData;
            }

            const data: any = response.data;

            const responseData: ResponseData<ResponseDataUpdatingProjectInterface> = {
                success: data.success,
                message: data.message,
                data: data.data,
                status: response.status
            }

            return responseData;
        } catch (error) {
            console.error("Request that caused the error: ", error?.request);
            return { success: error?.response?.data, request: error?.request, status: error.response ? error.response.status : null };
        }
    }

    static async update(id: string, payload: UpdateProjectInterface, accessToken: string) {
        try {
            const response = await axios.put(`${this.baseUrl}/update/${id}`, payload, {
                withCredentials: true,
                validateStatus: status => status >= 200 && status <= 500,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            if (!response) {
                const responseData: ResponseData<any> = {
                    success: false,
                    message: 'An error occurs. Please try again.',
                    data: null,
                    status: HttpStatusCode.BAD_GATEWAY
                }

                return responseData;
            }

            const data: any = response.data;

            const responseData: ResponseData<ResponseDataUpdatingProjectInterface> = {
                success: data.success,
                message: data.message,
                data: data.data,
                status: response.status
            }

            return responseData;
        } catch (error) {
            console.error("Request that caused the error: ", error?.request);
            return { success: error?.response?.data, request: error?.request, status: error.response ? error.response.status : null };
        }
    }

    static async destroy(id: string, accessToken: string) {
        try {
            const response = await axios.delete(`${this.baseUrl}/update/${id}`, {
                withCredentials: true,
                validateStatus: status => status >= 200 && status <= 500,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            if (!response) {
                const responseData: ResponseData<any> = {
                    success: false,
                    message: 'An error occurs. Please try again.',
                    data: null,
                    status: HttpStatusCode.BAD_GATEWAY
                }

                return responseData;
            }

            const data: any = response.data;

            const responseData: ResponseData<any> = {
                success: data.success,
                message: data.message,
                data: data.data,
                status: response.status
            }

            return responseData;
        } catch (error) {
            console.error("Request that caused the error: ", error?.request);
            return { success: error?.response?.data, request: error?.request, status: error.response ? error.response.status : null };
        }
    }
}

export class Storage {
    static baseUrl: string = 'http://localhost:3000/v1/file';

    static async upload(payload: UploadFileInterface, accessToken: string) {
        const formData = new FormData();
        for (const file in payload.files) {
            formData.append('files', file);
        }

        formData.append('projectId', payload.projectId);

        try {
            const response = await axios.post(`${this.baseUrl}/upload`, formData, {
                withCredentials: true,
                validateStatus: status => status >= 200 && status <= 500,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            if (!response) {
                const responseData: ResponseData<any> = {
                    success: false,
                    message: 'An error occurs. Please try again.',
                    data: null,
                    status: HttpStatusCode.BAD_GATEWAY
                }

                return responseData;
            }

            const data: any = response.data;

            const responseData: ResponseData<ResponseDataUploadingFileInterface> = {
                success: data.success,
                message: data.message,
                data: data.data,
                status: response.status
            }

            return responseData;
        } catch (error) {
            console.error("Request that caused the error: ", error?.request);
            return { success: error?.response?.data, request: error?.request, status: error.response ? error.response.status : null };
        }
    }

    static async download(path: string, accessToken: string) {
        try {
            const response = await axios.get(`${this.baseUrl}/download?path=${path}`, {
                withCredentials: true,
                validateStatus: status => status >= 200 && status <= 500,
                responseType: 'blob', 
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            if (!response) {
                const responseData: ResponseData<any> = {
                    success: false,
                    message: 'An error occurs. Please try again.',
                    data: null,
                    status: HttpStatusCode.BAD_GATEWAY
                }

                return responseData;
            }

            const data: any = response.data;

            const responseData: ResponseData<any> = {
                success: data.success,
                message: data.message,
                data: data.data,
                status: response.status
            }

            return responseData;
        } catch (error) {
            console.error("Request that caused the error: ", error?.request);
            return { success: error?.response?.data, request: error?.request, status: error.response ? error.response.status : null };
        }
    }

    static async destroy(id: string, accessToken: string) {
        try {
            const response = await axios.delete(`${this.baseUrl}/delete/${id}`, {
                withCredentials: true,
                validateStatus: status => status >= 200 && status <= 500,
                responseType: 'blob', 
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            if (!response) {
                const responseData: ResponseData<any> = {
                    success: false,
                    message: 'An error occurs. Please try again.',
                    data: null,
                    status: HttpStatusCode.BAD_GATEWAY
                }

                return responseData;
            }

            const data: any = response.data;

            return data; // blob
        } catch (error) {
            console.error("Request that caused the error: ", error?.request);
            return { success: error?.response?.data, request: error?.request, status: error.response ? error.response.status : null };
        }
    }
}