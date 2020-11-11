const Message = require('../models/Message');

const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next);

module.exports = (io, sessionMiddleware, passport) => {
  // This allows to us to see the user in sockets
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
      // users.push(socket.request.user.username);

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
      // users.pop(socket.request.user.username);
    });
  });
};
