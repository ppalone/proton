const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/User');

module.exports = (passport) => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
      },
      async (email, password, done) => {
        try {
          let user = await User.findOne({ email: email });

          // Check if user with this email exists
          if (!user)
            return done(null, false, { message: 'Email not registered' });

          // User exists, check password
          let match = await bcrypt.compare(password, user.password);

          if (!match)
            return done(null, false, { message: 'Password is incorrect' });

          // Everything went well
          return done(null, user);
        } catch (err) {
          done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
  });
};
