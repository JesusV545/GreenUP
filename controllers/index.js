const router = require('express').Router();

const apiRoutes = require('./api');
const viewRoutes = require('./homeRoutes');
const productRoutes = require('./productRoutes');

router.use('/', viewRoutes);
router.use('/products', productRoutes);
router.use('/api', apiRoutes);

module.exports = router;
