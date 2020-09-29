module.exports = {
  getLoginPage: (req, res) => {
    res.render('login');
  },
  getSignupPage: (req, res) => {
    res.render('signup');
  },
};
