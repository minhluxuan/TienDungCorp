const router = require("express").Router();
const projectController = require("../controllers/projectController");
const DiskStorage = require("../models/DiskStorage");
const auth = require("../lib/auth");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const diskStorage = new DiskStorage("file", 100 * 1024 * 1024, 256, "../uploads/temp", "../uploads/main");

const sessionStrategy = new LocalStrategy({
  usernameField: "username",
  passwordField: "password",
}, async (username, password, done) => {
  try {

      if (username !== process.env.ACCOUNT || password !== process.env.PASSWORD) {
          return done(null, false);
      }

      return done(null, true);
  } catch (error) {
      console.log(error);
      done(error);
  }
});

passport.use("normalLogin", sessionStrategy);


router.post("/login", passport.authenticate("normalLogin"), (req, res, next) => {
  passport.authenticate("normalLogin", (err, user, info) => {
      if (err) {
          return next(err);
      }
      if (!user) {
          return res.status(401).json({ error: true, valid: false, message: "Xác thực thất bại." });
      }

      return res.status(200).json({ error: false, valid: true, message: "Xác thực thành công." });
  })(req, res, next);
});

router.post("/project/create", projectController.createNewProject);
router.post("/project/file", diskStorage.upload.single(diskStorage.fieldName), projectController.uploadFileBelongToProject);
router.post("/project/post", diskStorage.upload.single(diskStorage.fieldName), projectController.savePost);
router.post("/project/get", projectController.getProjects);
router.get("/project/file", projectController.getFile);
router.delete("/project", projectController.deleteProject);



module.exports = router;

