const fileRepository = require("../repositories/fileRepository");

const saveFile = async (data) => {
    return fileRepository.insert(data);
}

const deleteFile = async (data) => {
    return fileRepository.remove(data);
}

module.exports = {
    saveFile,
    deleteFile
}