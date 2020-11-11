const passport = require('passport');
const router = require('express').Router();
const authControllers = require('../../controllers/auth/auth');
const authMiddlewares = require('../../middlewares/auth');

router
  .get('/login', authMiddlewares.forwardAuth, authControllers.getLoginPage)
  .post('/login', authControllers.checkLoginCredentials)
  .get('/signup', authMiddlewares.forwardAuth, authControllers.getSignupPage)
  .post('/signup', authControllers.saveUser)
  .get('/logout', authMiddlewares.ensureAuth, authControllers.logoutUser)
  .get(
    '/auth/github',
    passport.authenticate('github', { scope: ['user:email'] })
  )
  .get(
    '/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {
      res.redirect('/chat');
    }
  );

module.exports = router;
