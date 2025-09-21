const router = require('express').Router();
const { Product } = require('../models');

// route to get all products
router.get('/', async (req, res) => {
  try {
    const productData = await Product.findAll();
    const products = productData.map((product) => product.get({ plain: true }));
    return res.render('all', { products });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load products.' });
  }
});

// route to get one product
router.get('/:id', async (req, res) => {
  try {
    const productData = await Product.findByPk(req.params.id);

    if (!productData) {
      return res.status(404).json({ message: 'No products with this id.' });
    }

    const product = productData.get({ plain: true });
    return res.render('product', { ...product });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load product.' });
  }
});

module.exports = router;
