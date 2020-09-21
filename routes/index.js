const router = require('express').Router();

router.get('/', (req, res) => {
  res.send('Welcome to Proton Chat!');
});

module.exports = router;
