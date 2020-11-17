const mongoose = require('mongoose');
const Message = require('../../models/Message');
const Room = require('../../models/Room');

module.exports = {
  //@route GET /chat
  //@desc Get all the chat
  getChat: async (req, res) => {
    // console.log(req.user);
    try {
      // let isAdmin = req.user.isAdmin;
      // let messages = await Message.find({})
      //   .sort({ createdAt: 1 })
      //   .populate('by', 'username');

      // Get all rooms
      let rooms = await Room.find({});

      // console.log(rooms);
      // No rooms
      if (rooms.length === 0) {
        let newroom = new Room({
          name: 'general',
        });

        let room = await newroom.save();
        return res.redirect(`/chat/${room.id}`);
      }

      res.redirect(`/chat/${rooms[0].id}`);
      // console.log(messages);
      // res.render('chat', { messages, isAdmin, rooms });
    } catch (err) {
      console.log('Error: ' + err);
      res.send('Server internal error');
    }
  },

  //@route GET /chat/:room
  //@desc Get Messages from specific room
  getRoom: async (req, res) => {
    try {
      const { roomid } = req.params;

      let room = await Room.findById(mongoose.Types.ObjectId(roomid));

      if (!room) {
        return res.send('Error 404: Page not found!');
      }

      let messages = await Message.find({ room: room.id })
        .sort({ createdAt: 1 })
        .populate('by', 'username');
      let rooms = await Room.find({});
      let isAdmin = req.user.isAdmin;

      res.render('chat', { messages, isAdmin, room, rooms });
    } catch (err) {
      console.log(err);
    }
  },
};
