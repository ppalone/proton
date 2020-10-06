const router = require('express').Router();
const authControllers = require('../../controllers/auth/auth');
const authMiddlewares = require('../../middlewares/auth');

router
  .get('/login', authMiddlewares.forwardAuth, authControllers.getLoginPage)
  .post('/login', authControllers.checkLoginCredentials)
  .get('/signup', authMiddlewares.forwardAuth, authControllers.getSignupPage)
  .post('/signup', authControllers.saveUser)
  .get('/logout', authMiddlewares.ensureAuth, authControllers.logoutUser);

module.exports = router;
