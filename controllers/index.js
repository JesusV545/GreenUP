const router = require('express').Router();

const apiRoutes = require('./api');
const homeRoutes = require('./homeRoutes');
// This will be the api for our items
const productRoutes = require('./productRoutes');

router.use('/', homeRoutes);
router.use('/product', productRoutes);
router.use('/api', apiRoutes);

// router.use('/users', userRoutes);

module.exports = router;
