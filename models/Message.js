const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema(
  {
    text: {
      type: String,
    },
    by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', MessageSchema);
