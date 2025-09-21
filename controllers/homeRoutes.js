const router = require('express').Router();

const render = (view) => (req, res, next) => {
  try {
    res.render(view);
  } catch (error) {
    next(error);
  }
};

router.get('/', render('login'));
router.get('/signup', render('signUp'));
router.get('/cart', render('cart'));
router.get('/about-us', render('aboutUs'));

module.exports = router;
