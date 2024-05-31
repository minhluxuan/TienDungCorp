var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var projectRouter = require("./routes/projectRoute");
var staffRouter = require("./routes/staffRoute");
const auth = require("./lib/auth");
const session = require("express-session");
const passport = require("passport");
const dotenv = require("dotenv");

dotenv.config();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
  origin: ["http://localhost:3002", "http://127.0.0.1:5500"],
  credentials: true
}))

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
      // secure: false,
      // sameSite: 'None',
      httpOnly: true,
      maxAge: 12 * 60 * 60 * 1000,
  },
});

app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/v1/media", projectRouter);
app.use('/v1/staff', staffRouter);

app.get("/get_session", (req, res) => {
  console.log(req.session);
  res.status(200).json({
      error: false,
      message: "Lấy phiên đăng nhập thành công.",
  });
});

app.get("/destroy_session", (req, res) => {
  req.logout(() => {
      req.session.destroy();
  });
  return res.status(200).json({
      error: false,
      message: "Hủy phiên hoạt động thành công.",
  });
});

passport.serializeUser(auth.setSession);
passport.deserializeUser((user, done) => {
    auth.verifyPermission(user, done);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
