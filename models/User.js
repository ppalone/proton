const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  githubId: {
    type: String,
  },
});

// TODO: Hash password before saving

module.exports = mongoose.model('User', UserSchema);
