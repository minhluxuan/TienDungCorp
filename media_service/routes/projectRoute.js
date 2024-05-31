const router = require("express").Router();
const projectController = require("../controllers/projectController");
const DiskStorage = require("../models/DiskStorage");
const auth = require("../lib/auth");
const { route } = require("./staffRoute");

const diskStorage = new DiskStorage("file", 100 * 1024 * 1024, 256, "../uploads/temp", "../uploads/main");

router.get("/project", projectController.createNewProject);
router.post("/project/file", diskStorage.upload.single(diskStorage.fieldName), projectController.uploadFileBelongToProject);
router.post("/project/post", diskStorage.upload.single(diskStorage.fieldName), projectController.savePost);
router.post("/project", projectController.getProjects);
router.get("/project/file", projectController.getFile);
router.delete("/project", projectController.deleteProject);

router.post("/uploadImg", diskStorage.upload.single(diskStorage.fieldName), projectController.uploadVideoImage)
router.get("/getImg", projectController.getVideoImage);

module.exports = router;

