const router = require('express').Router();
const { Product } = require('../models');

const respondWithViewOrJson = (req, res, view, payload, status = 200) => {
  const preferred = req.accepts(['html', 'json']);

  if (preferred === 'html') {
    return res.status(status).render(view, payload);
  }

  return res.status(status).json(payload);
};

const respondNotFound = (req, res, message) => {
  const preferred = req.accepts(['html', 'json']);

  if (preferred === 'html') {
    return res.status(404).send(message);
  }

  return res.status(404).json({ message });
};

// route to get all products
router.get('/', async (req, res, next) => {
  try {
    const productData = await Product.findAll();
    const products = productData.map((product) => product.get({ plain: true }));
    return respondWithViewOrJson(req, res, 'all', { products });
  } catch (error) {
    if (req.app.get('env') !== 'production') {
      console.error('Failed to fetch products', error);
    }
    error.status = 500;
    error.message = 'Failed to load products.';
    return next(error);
  }
});

// route to get one product
router.get('/:id', async (req, res, next) => {
  try {
    const productData = await Product.findByPk(req.params.id);

    if (!productData) {
      return respondNotFound(req, res, 'No product found.');
    }

    const product = productData.get({ plain: true });
    return respondWithViewOrJson(req, res, 'product', { ...product });
  } catch (error) {
    if (req.app.get('env') !== 'production') {
      console.error('Failed to fetch product', error);
    }
    error.status = 500;
    error.message = 'Failed to load product.';
    return next(error);
  }
});

module.exports = router;
