const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/auth');
const Message = require('../../models/Message');

router.get('/chat', authMiddleware.ensureAuth, async (req, res) => {
  // console.log(req.user);
  try {
    let messages = await Message.find({}).populate('by', 'username');
    // console.log(messages);
    res.render('chat', { messages });
  } catch (err) {
    console.log('Error: ' + err);
    res.send('Server internal error');
  }
});

module.exports = router;
