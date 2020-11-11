// Use dotenv if not in production
if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');

const app = express();
const http = require('http').createServer(app);

// Socket
const io = require('socket.io')(http);

const port = process.env.PORT || 8000;

const routesHandler = require('./routes/index');
const passport = require('passport');
const Message = require('./models/Message');

// Passport configuration
require('./config/passport')(passport);

// Express Session Option
const sessionMiddleware = session({
  // Name of the session id
  name: 'proton_sid',
  secret: process.env.EXPRESS_SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
});

// Active users
// const users = [];

// Connect to MongoDB
require('./config/database');

// Middlewares
app.use(express.static(path.join(__dirname, '/public')));
app.set('view engine', 'ejs');

// body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Express Session Middleware
app.use(sessionMiddleware);

// Password Middleware
app.use(passport.initialize());
app.use(passport.session());

// io
require('./io/io')(io, sessionMiddleware, passport);

// Connect flash middleware
app.use(flash());

// Set global variables
app.use(function (req, res, next) {
  // Passport error
  res.locals.error = req.flash('error');
  // Custom
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});

// TODO: better way to get the active users
// Gets active users
// app.get('/active', (req, res) => {
//   // Set removes duplicates from the array
//   res.json([...new Set(users)]);
// });

app.use(routesHandler);

app.get('*', (req, res) => {
  res.send('Page not found');
});

http.listen(port, console.log(`Server started at port ${port}`));
