const router = require('express').Router();

const render =
  (view, locals = {}) =>
  (req, res, next) => {
    try {
      res.render(view, locals);
    } catch (error) {
      next(error);
    }
  };

router.get('/', render('login'));
router.get('/signup', (req, res) => res.redirect('/'));
router.get(
  '/cart',
  render('cart', { cartItems: [], cartSummary: { subtotal: '0.00', tax: '0.00', total: '0.00' } })
);
router.get('/about-us', render('aboutUs'));

module.exports = router;
