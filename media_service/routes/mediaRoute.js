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
    return done(null, { username }); // Trả về thông tin người dùng nếu thành công
  } catch (error) {
    done(error);
  }
});

passport.use("normalLogin", sessionStrategy);

// Middleware để xử lý kết quả xác thực từ passport.authenticate
const handleAuthentication = (req, res, next) => {
  passport.authenticate("normalLogin", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ error: true, valid: false, message: "Xác thực thất bại." });
    }
    // Nếu thành công, gắn user vào req để sử dụng ở các middleware hoặc route khác
    req.user = user;
    return next(); // Chuyển tiếp đến middleware hoặc route tiếp theo
  })(req, res, next);
};


const diskStorage = new DiskStorage("file", 100 * 1024 * 1024, 256, "../uploads/temp", "../uploads/main");

router.post("/login", handleAuthentication, (req, res) => {
  // Đến đây chỉ khi xác thực thành công
  return res.status(200).json({ error: false, valid: true, message: "Xác thực thành công." });
});

router.post("/upload",auth.isAuthenticated(), diskStorage.upload.single(diskStorage.fieldName), mediaController.upload);
router.get("/file", mediaController.getFile);
router.post("/post", mediaController.getPosts);
router.post("/uploadImg", diskStorage.upload.single(diskStorage.fieldName), mediaController.uploadVideoImage)
router.get("/getImg", mediaController.getVideoImage);

module.exports = router;

