const Room = require('../../models/Room');

// @route GET /rooms/new
// @desc Get form to create Room
// Only admins can create new Rooms
const getNewRoomForm = (req, res) => {
  res.render('room');
};

// @route POST /rooms
// @desc Create a new room and save into database
const createRoom = async (req, res) => {
  try {
    let { roomname } = req.body;

    let existingRoom = await Room.findOne({ name: roomname.toLowerCase() });

    // Check if room with this name already exists
    if (existingRoom) {
      req.flash('error_msg', 'Room with this name already exists');
      return res.redirect('/rooms/new');
    }

    let newroom = new Room({
      name: roomname.toLowerCase(),
    });

    let room = await newroom.save();
    res.redirect(`/chat/${room.id}`);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getNewRoomForm,
  createRoom,
};
