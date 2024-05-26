const Joi = require("joi");

const validateUploadingContent = (data) => {
    return Joi.object({
        title: Joi.string(),
        author: Joi.string(),
    }).strict().validate(data);
}

module.exports = {
    validateUploadingContent,
}