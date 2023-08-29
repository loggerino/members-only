require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport');
const flash = require('express-flash');
const session = require("express-session");
const LocalStrategy = require('passport-local').Strategy;
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const authenticationRouter = require('./routes/authentication');
const messageRouter = require('./routes/messages');
const adminRouter = require('./routes/admin');
const User = require('./models/user');

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
},
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user) return done(null, false, { message: 'Incorrect email.' });

      const passwordMatch = await user.comparePassword(password);
      if (!passwordMatch) return done(null, false, { message: 'Incorrect password.' });

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));


passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  };
});

var app = express();

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const mongoDB = process.env.DATABASE_URL;

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(mongoDB);
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(session({ secret: "cats", resave: true, saveUninitialized: false }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authenticationRouter);
app.use('/messages', messageRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
