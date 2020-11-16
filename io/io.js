const room = require('../controllers/room/room');
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

    // socket.join(room);

    socket.on('join', (room) => {
      // socket.broadcast.emit('message', {
      //   username: 'Bot 🤖',
      //   message: `${socket.request.user.username} has joined the chat 🤩`,
      // });
      // if (!users.includes(socket.request.user.username)) {
      // }
      // users.push(socket.request.user.username);

      // Send the username of the loggedin user when user joins
      socket.join(room);

      socket.emit('join', {
        username: socket.request.user.username,
      });
    });

    socket.on('message', async (data) => {
      // Get the user who sent the message
      // Emit to all users accept the current user
      // data = {
      //   username: socket.request.user.username,
      //   message: msg,

      // console.log(data);

      // };
      try {
        let newmessage = new Message({
          text: data.msg,
          by: socket.request.user.id,
          room: data.room,
        });

        await newmessage.save();

        // socket.broadcast.emit('message', {
        //   username: socket.request.user.username,
        //   message: msg,
        // });

        socket.to(data.room).emit('message', {
          username: socket.request.user.username,
          message: data.msg,
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
