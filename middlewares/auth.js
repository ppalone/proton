module.exports = {
  ensureAuth: (req, res, next) => {
    if (!req.isAuthenticated()) {
      req.flash('error_msg', 'Please Login to view this resource');
      return res.redirect('/login');
    }
    next();
  },
  forwardAuth: (req, res, next) => {
    if (req.isAuthenticated()) {
      return res.redirect('/chat');
    }
    next();
  },
};
