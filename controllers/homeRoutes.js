const router = require('express').Router();

router.get('/', (req, res) => {
  res.render('login');
});

router.get('/signUp', (req, res) => {
  res.render('signUp');
});

router.get('/cart', (req, res) => {
  res.render('cart');
});

router.get('/aboutUs', (req, res) => {
  res.render('aboutUs');
});

module.exports = router;
