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
// const authMiddleware = require('./middlewares/auth');
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
const users = [];

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

const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));

// io Middleware
// io.use((socket, next) => {
//   // Now we can access the passport body in sockets
//   // userid = socket.request.session.passport.user;
//   sessionMiddleware(socket.request, {}, next);
// });

io.use((socket, next) => {
  // console.log(socket.request.user);
  if (socket.request.user) {
    next();
  } else {
    next(new Error('unauthorized'));
  }
});

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

// Socket Handling
io.on('connection', async (socket) => {
  // console.log(socket.request);
  // console.log('User connected!');
  // Look for new user

  socket.on('join', () => {
    // socket.broadcast.emit('message', {
    //   username: 'Bot 🤖',
    //   message: `${socket.request.user.username} has joined the chat 🤩`,
    // });
    // if (!users.includes(socket.request.user.username)) {
    // }
    users.push(socket.request.user.username);

    // Send the username of the loggedin user when user joins
    socket.emit('join', {
      username: socket.request.user.username,
    });
  });

  socket.on('message', async (msg) => {
    // Get the user who sent the message
    // Emit to all users accept the current user
    // data = {
    //   username: socket.request.user.username,
    //   message: msg,
    // };
    try {
      let newmessage = new Message({
        text: msg,
        by: socket.request.user._id,
      });

      await newmessage.save();

      socket.broadcast.emit('message', {
        username: socket.request.user.username,
        message: msg,
      });
    } catch (err) {
      console.log('Error: ' + err);
    }
  });

  socket.on('disconnect', () => {
    // io.emit('message', {
    //   username: 'Bot 🤖',
    //   message: `${socket.request.user.username} has left the chat 😢`,
    // });
    users.pop(socket.request.user.username);
  });
});

// TODO: better way to get the active users
// Gets active users
app.get('/active', (req, res) => {
  // Set removes duplicates from the array
  res.json([...new Set(users)]);
});

app.use(routesHandler);

app.get('*', (req, res) => {
  res.send('Page not found');
});

http.listen(port, console.log(`Server started at port ${port}`));
