const mediaRepository = require("../repositories/mediaRepository");

const savePost = async (data) => {
    return await mediaRepository.insert(data);
}

const getPostById = async (id) => {
    return await mediaRepository.findById(id);
}

const getPosts = async (criteria) => {
    return await mediaRepository.find(criteria);
}


module.exports = {
    savePost,
    getPostById,
    getPosts,
}