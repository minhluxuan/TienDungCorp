const router = require("express").Router();
const mediaController = require("../controllers/mediaController");
const DiskStorage = require("../models/DiskStorage");
const auth = require("../lib/auth");
const { route } = require("./staffRoute");


const diskStorage = new DiskStorage("file", 100 * 1024 * 1024, 256, "../uploads/temp", "../uploads/main");


router.post("/upload",auth.isAuthenticated(), diskStorage.upload.single(diskStorage.fieldName), mediaController.upload);
router.get("/file", mediaController.getFile);
router.post("/post", mediaController.getPosts);
router.post("/uploadImg", diskStorage.upload.single(diskStorage.fieldName), mediaController.uploadVideoImage)
router.get("/getImg", mediaController.getVideoImage);

module.exports = router;

