import { StatusCodes as HttpStatusCode } from "http-status-codes";

export enum NewsType {
    SPORT = 'SPORT',
    CULTURE = 'CULTURE',
    FINANCE = 'FINANCE',
    BUSINESS = 'BUSINESS',
    EDUCATION = 'EDUCATION',
    POLITIC = 'POLITIC',
    SOCIAL = 'SOCIAL'
}

export interface ResponseData<T> {
    success: boolean;
    message: string;
    data: T;
    status: HttpStatusCode
}

export interface LoginPayloadInterface {
    username: string;
    password: string;
}

export interface ResponseDataLoggingInInterface {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    createdAt: Date;
    updatedAt: Date;
    accessToken: string;
}

export interface ResponseDataGettingUserInfoInterface {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateProjectInterface {
    name: string;
    title: string;
    type: NewsType;
}

export interface ResponseDataCreatingProjectInterface {
    id: string;
    name: string;
    title: string;
    authorId: string;
    type: NewsType;
    createdAt: Date;
    updatedAt: Date;
    user: {
        id: string;
        username: string;
        firstName: string;
        lastName: string;
    },
    files: [
        {
            id: string;
            name: string;
            path: string;
            projectId: string;
            createdAt: Date;
            updatedAt: Date
        }
    ]
}

export interface ResponseDataSearchingProjectInterface {
    id: string;
    name: string;
    title: string;
    authorId: string;
    type: NewsType;
    createdAt: Date;
    updatedAt: Date;
    user: {
        id: string;
        username: string;
        firstName: string;
        lastName: string;
    },
    files: [
        {
            id: string;
            name: string;
            path: string;
            projectId: string;
            createdAt: Date;
            updatedAt: Date
        }
    ]
};

export interface ResponseDataUpdatingProjectInterface {
    id: string;
    name: string;
    title: string;
    authorId: string;
    type: NewsType;
    createdAt: Date;
    updatedAt: Date;
    user: {
        id: string;
        username: string;
        firstName: string;
        lastName: string;
    },
    files: [
        {
            id: string;
            name: string;
            path: string;
            projectId: string;
            createdAt: Date;
            updatedAt: Date
        }
    ]
}

export interface UploadFileInterface {
    projectId: string;
    files: File[];
}

export interface ResponseDataUploadingFileInterface {
    id: string;
    name: string;
    path: string;
    projectId: string;
    updatedAt: Date;
    createdAt: Date
}

export interface UpdateProjectInterface {
    title: string;
    name: string;
    type: NewsType;
}

export interface UpdateProjectContentInterface {
    content: string;
}

export interface SearchPayload {
    criteria: SearchCriteria[],
    addition: SearchAddition
}

export interface SearchCriteria {
    field: string;
    operator: '~' | '!~' | '=' | '!=' | 'isSet' | 'isNotSet' | '<' | '<=' | '>' | '>=';
    value?: any;
}

export interface SearchAddition {
    sort: [string, 'ASC' | 'DESC'][],
    page: number,
    size: number,
    group: string[]
}