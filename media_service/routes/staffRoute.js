const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const express = require("express");

const sessionStrategy = new LocalStrategy({
  usernameField: "username",
  passwordField: "password",
}, async (username, password, done) => {
  try {

      if (username !== process.env.ACCOUNT || password !== process.env.PASSWORD) {
          done(null, false);
      }
      return done(null, true);

    } catch (error) {
    //   console.log(error);
      done(error);
    }
});

passport.use("normalLogin", sessionStrategy);

const router = express.Router();

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


module.exports = router;
