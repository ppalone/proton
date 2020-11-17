const mongoose = require('mongoose');
const Message = require('../../models/Message');
const Room = require('../../models/Room');

// @route GET /chat
// @desc Get the chat
const getChat = async (req, res) => {
  try {
    let rooms = await Room.find({});

    // if there are no rooms create one
    if (rooms.length === 0) {
      let newroom = new Room({
        name: 'general',
      });

      let room = await newroom.save();
      return res.redirect(`/chat/${room.id}`);
    }

    // Redirect to the first room
    res.redirect(`/chat/${rooms[0].id}`);
  } catch (err) {
    console.log('Error: ' + err);
    res.send('Server internal error');
  }
};

// @route GET /chat/:roomid
// @desc Get chat of specific room

const getRoomChat = async (req, res) => {
  try {
    // Get the room id
    const { roomid } = req.params;

    let room = await Room.findById(mongoose.Types.ObjectId(roomid));

    if (!room) {
      return res.send('Error 404: Page not found!');
    }

    let messages = await Message.find({ room: room.id })
      .sort({ createdAt: 1 })
      .populate('by', 'username');

    // All the rooms
    let rooms = await Room.find({});

    // Check if the user is Admin
    let isAdmin = req.user.isAdmin;
    res.render('chat', { messages, isAdmin, room, rooms });
  } catch (err) {
    console.log(err);
    res.send('Server Internal Error');
  }
};

module.exports = {
  getChat,
  getRoomChat,
};
