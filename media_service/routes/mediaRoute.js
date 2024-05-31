const router = require("express").Router();
const mediaController = require("../controllers/mediaController");
const DiskStorage = require("../models/DiskStorage");
const auth = require("../lib/auth");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const sessionStrategy = new LocalStrategy({
  usernameField: "username",
  passwordField: "password",
}, async (username, password, done) => {
  try {
    if (username !== process.env.ACCOUNT || password !== process.env.PASSWORD) {
      return done(null, false);
    }
    console.log(username);
    return done(null, true); // Trả về thông tin người dùng nếu thành công
  } catch (error) {
    done(error);
  }
});

passport.use("normalLogin", sessionStrategy);



const diskStorage = new DiskStorage("file", 100 * 1024 * 1024, 256, "../uploads/temp", "../uploads/main");

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


router.post("/upload",auth.isAuthenticated(), diskStorage.upload.single(diskStorage.fieldName), mediaController.upload);
router.get("/file", mediaController.getFile);
router.post("/post", mediaController.getPosts);
router.post("/uploadImg", diskStorage.upload.single(diskStorage.fieldName), mediaController.uploadVideoImage)
router.get("/getImg", mediaController.getVideoImage);

module.exports = router;

