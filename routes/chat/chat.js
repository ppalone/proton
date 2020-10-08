const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/auth');
const chatController = require('../../controllers/chat/chat');

router.get('/chat', authMiddleware.ensureAuth, chatController.getChat);

module.exports = router;
