const Room = require('../../models/Room');

module.exports = {
  getNewRoomForm: (req, res) => {
    res.render('room');
  },
  createRoom: async (req, res) => {
    try {
      const { roomname } = req.body;
      // console.log(roomname);

      // Check if room with this name already exists

      let existingRoom = await Room.findOne({ name: roomname });

      if (existingRoom) {
        req.flash('error_msg', 'Room with this name already exists');
        return res.redirect('/rooms/new');
      }

      let newroom = new Room({
        name: roomname,
      });

      let room = await newroom.save();
      res.redirect(`/chat/${room.id}`);
    } catch (err) {
      console.log(err);
    }

    // Redirect to the new room after creating
  },
};
