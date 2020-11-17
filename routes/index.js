const router = require('express').Router();

const authRoutes = require('./auth/auth');
const chatRoutes = require('./chat/chat');
const roomRoutes = require('./room/room');

const authMiddlewares = require('../middlewares/auth');

router.get('/', authMiddlewares.forwardAuth, (req, res) => {
  res.render('index');
});

router.use(authRoutes);
router.use(roomRoutes);
router.use(chatRoutes);

module.exports = router;
