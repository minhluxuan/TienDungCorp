const Joi = require("joi");

const validateCreatingNewProject = (data) => {
    return Joi.object({
        name: Joi.string().required(),
        title: Joi.string(),
        author: Joi.string(),
        type: Joi.number()
    }).strict().validate(data);
}

const validateProjectId = (data) => {
    return Joi.object({
        id: Joi.string(),
    }).strict().validate(data);
}

const validateGettingFile = (data) => {
    return Joi.object({
        project_id: Joi.string().required(),
        file: Joi.string().required(),
    }).strict().validate(data);  
}

const validateGettingPost = (data) => {
    return Joi.object({
        id: Joi.string(),
        name: Joi.string(),
        author: Joi.string(),
        title: Joi.string(),
        yearEnd: Joi.number().min(2024),
        yearStart: Joi.number().min(2024),
    }).strict().validate(data);
}

const validateUploadingContent = (data) => {
    return Joi.object({
        title: Joi.string(),
        author: Joi.string(),
        type: Joi.number()
    }).strict().validate(data);
}

const validateGettingImage = (data) => {
    return Joi.object({
        path: Joi.string().required(),
    }).strict().validate(data);  
}

module.exports = {
    validateCreatingNewProject,
    validateProjectId,
    validateUploadingContent,
    validateGettingFile,
    validateGettingPost,
    validateGettingImage,
}