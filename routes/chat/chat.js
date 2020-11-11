const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/auth');
const chatController = require('../../controllers/chat/chat');

router
  .get('/chat', authMiddleware.ensureAuth, chatController.getChat)
  .get('/chat/rooms/:room', authMiddleware.ensureAuth, chatController.getRoom)
  .post(
    '/chat/rooms',
    authMiddleware.ensureAuth,
    authMiddleware.isAdmin,
    chatController.createRoom
  );

module.exports = router;
