const router = require('express').Router();
const authRoutes = require('./userRoutes');
const commentRoutes = require('./comments');

router.use('/auth', authRoutes);
router.use('/comments', commentRoutes);

module.exports = router;
