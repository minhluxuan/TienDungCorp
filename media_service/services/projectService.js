const mediaRepository = require("../repositories/projectRepository");
const fileRepository = require("../repositories/fileRepository");

const saveProject = async (data) => {
    return await mediaRepository.insert(data);
}

const getProjectById = async (id) => {
    return await mediaRepository.findById(id);
}

const getProjects = async (criteria) => {
    const projects = await mediaRepository.find(criteria);
    for (const project of projects) {
        project.files = await fileRepository.find({ project_id: project.id});
    }

    return projects;
}

const checkExistProject = async (id) => {
    return await mediaRepository.existById(id);
}

const deleteProject = async (id) => {
    return await mediaRepository.deleteById(id);
}

module.exports = {
    saveProject,
    getProjectById,
    getProjects,
    checkExistProject,
    deleteProject,
}