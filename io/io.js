const Message = require('../models/Message');

const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next);

module.exports = (io, sessionMiddleware, passport) => {
  // This allows to us to see the user in sockets
  // https://github.com/socketio/socket.io/tree/master/examples/passport-example
  io.use(wrap(sessionMiddleware));
  io.use(wrap(passport.initialize()));
  io.use(wrap(passport.session()));

  io.use((socket, next) => {
    // if the user is authenticated it will create socket.request.user
    if (socket.request.user) {
      next();
    } else {
      next(new Error('Unauthorized'));
    }
  });

  // Socket Handling
  io.on('connection', async (socket) => {
    socket.on('join', async (room) => {
      // Subscribe user to the room
      socket.join(room);
      // Send back user the username
      socket.emit('join', {
        username: socket.request.user.username,
      });
    });

    socket.on('message', async (data) => {
      try {
        let newmessage = new Message({
          text: data.msg,
          by: socket.request.user.id,
          room: data.room,
        });

        await newmessage.save();

        // Emit message to the room
        socket.to(data.room).emit('message', {
          username: socket.request.user.username,
          message: data.msg,
        });
      } catch (err) {
        console.log('Error: ' + err);
      }
    });

    socket.on('typing', (data) => {
      socket.to(data.room).emit('typing', {
        username: socket.request.user.username,
      });
    });

    socket.on('stoptyping', (data) => {
      if (data.user === socket.request.user.username) {
        socket.to(data.room).emit('stoptyping');
      }
    });

    socket.on('disconnect', () => {
      // TODO
    });
  });
};
