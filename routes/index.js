const router = require('express').Router();

const authRoutes = require('./auth/auth');
const chatRoutes = require('./chat/chat');

router.get('/', (req, res) => {
  res.render('index');
});

router.use(authRoutes);
router.use(chatRoutes);

module.exports = router;
