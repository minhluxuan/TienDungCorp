const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const express = require("express");

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

const router = express.Router();

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

router.post("/login", handleAuthentication, (req, res) => {
  // Đến đây chỉ khi xác thực thành công
  return res.status(200).json({ error: false, valid: true, message: "Xác thực thành công." });
});

module.exports = router;