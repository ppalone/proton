const router = require('express').Router();

const authRoutes = require('./auth/auth');

router.get('/', (req, res) => {
  res.render('index');
});

router.use(authRoutes);

module.exports = router;
