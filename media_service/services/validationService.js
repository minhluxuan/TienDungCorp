const Joi = require("joi");

const validateUploadingContent = (data) => {
    return Joi.object({
        title: Joi.string(),
        author: Joi.string(),
        type: Joi.number()
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
        yearEnd: Joi.number().min(2024),
        yearStart: Joi.number().min(2024),
        
    }).strict().validate(data);
}

module.exports = {
    validateUploadingContent,
    validateGettingFile,
    validateGettingPost,
}