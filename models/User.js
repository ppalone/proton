const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_FACTOR = 10;

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// TODO: Hash password before saving

module.exports = mongoose.model('User', UserSchema);
