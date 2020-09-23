const router = require('express').Router();
const authControllers = require('../../controllers/auth/auth');

router
  .get('/login', authControllers.getLoginPage)
  .get('/signup', authControllers.getSignupPage);

module.exports = router;
