const Message = require('../../models/Message');

module.exports = {
  //@route GET /chat
  //@desc Get all the chat
  getChat: async (req, res) => {
    // console.log(req.user);
    try {
      let messages = await Message.find({})
        .sort({ createdAt: 1 })
        .populate('by', 'username');
      // console.log(messages);
      res.render('chat', { messages });
    } catch (err) {
      console.log('Error: ' + err);
      res.send('Server internal error');
    }
  },
};
