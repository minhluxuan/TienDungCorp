const router = require("express").Router();
const mediaController = require("../controllers/mediaController");
const DiskStorage = require("../models/DiskStorage");

const diskStorage = new DiskStorage("file", 100 * 1024 * 1024, 256, "../uploads/temp", "../uploads/main");

router.post("/upload", diskStorage.upload.single(diskStorage.fieldName), mediaController.upload);
router.get("/file", mediaController.getFile);
router.post("/post", mediaController.getPosts);

module.exports = router;