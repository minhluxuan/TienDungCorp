const Joi = require("joi");

const validateUploadingContent = (data) => {
    return Joi.object({
        title: Joi.string(),
        author: Joi.string(),
    }).strict().validate(data);
}

const validateGettingFile = (data) => {
    return Joi.object({
        id: Joi.string().required(),
    }).strict().validate(data);  
}

const validateGettingPost = (data) => {
    return Joi.object({
        id: Joi.string(),
        author: Joi.string(),
        title: Joi.string(),
        monthCreated: Joi.number().min(1).max(12),
        yearCreated: Joi.number().min(2024),
    }).strict().validate(data);
}

module.exports = {
    validateUploadingContent,
    validateGettingFile,
    validateGettingPost,
}