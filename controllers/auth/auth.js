const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../../models/User');
const SALT_ROUNDS = 10;

module.exports = {
  //@route GET /login
  getLoginPage: (req, res) => {
    res.render('login');
  },

  //@route POST /login
  checkLoginCredentials: (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/chat',
      failureRedirect: '/login',
      failureFlash: true,
    })(req, res, next);
  },

  //@route GET /register
  getSignupPage: (req, res) => {
    res.render('signup');
  },

  //@route POST /register
  //@desc Save user to the database
  saveUser: async (req, res, next) => {
    try {
      // Get all user info
      const { username, email, password } = req.body;

      // Check if any fields are empty
      if (!username || !email || !password) {
        return res.render('signup', { errors: 'Please fill all the fields' });
      }

      // Check if user with this email already exist
      let existinguser = await User.findOne({ email: email });

      if (existinguser) {
        return res.render('signup', {
          errors: 'User with this email already exists',
        });
      }

      // Create a new user
      // Hash the password before saving
      // console.log(req.body);
      let SALT = await bcrypt.genSalt(SALT_ROUNDS);

      let hashedPassword = await bcrypt.hash(password, SALT);

      let newuser = new User({
        username: username,
        email: email,
        password: hashedPassword,
      });

      // Save the user
      let user = await newuser.save();

      // Everything went well
      // req.flash('success_msg', 'Registeration successful!');
      // return res.redirect('/login');

      // Login user after successful registeration
      req.login(user, (err) => {
        if (err) next(err);
        return res.redirect('/chat');
      });
    } catch (err) {
      console.log(err);
      res.send('Server Internal Error');
    }
  },

  //@route GET /logout
  logoutUser: (req, res, next) => {
    // Logout the user and destroy the session
    req.logout();
    req.session.destroy((err) => {
      if (err) next(err);
      res.redirect('/login');
    });
  },

  // @route /auth/github
  githubOAuth: passport.authenticate('github', { scope: ['user:email'] }),
};
