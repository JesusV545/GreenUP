const router = require('express').Router();
const { Comment, Product, User } = require('../../models');

const MAX_PAGE_SIZE = 50;
const ALLOWED_STATUSES = ['visible', 'hidden', 'flagged'];

const parsePagination = (req) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit, 10) || 10, MAX_PAGE_SIZE);
  const offset = (page - 1) * limit;

  return { page, limit, offset };
};

const respondWithMeta = (res, data, meta, status = 200) => res.status(status).json({ data, meta });

const requireAuth = (req, res, next) => {
  if (!req.session || !req.session.user_id) {
    return res.status(401).json({ message: 'Authentication required.' });
  }
  return next();
};

router.get('/', async (req, res, next) => {
  try {
    const { page, limit, offset } = parsePagination(req);
    const where = {};

    const statusFilter = req.query.status;
    if (statusFilter && ALLOWED_STATUSES.includes(statusFilter)) {
      where.status = statusFilter;
    } else {
      where.status = 'visible';
    }

    const productIdFilter = parseInt(req.query.productId, 10);
    if (!Number.isNaN(productIdFilter)) {
      where.product_id = productIdFilter;
    }

    const result = await Comment.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']],
      include: [
        { model: User, attributes: ['id', 'name'] },
        { model: Product, attributes: ['id', 'name', 'slug'] },
      ],
    });

    const totalPages = Math.max(Math.ceil(result.count / limit), 1);

    return respondWithMeta(res, result.rows, {
      total: result.count,
      page,
      pageSize: limit,
      totalPages,
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const comment = await Comment.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ['id', 'name'] },
        { model: Product, attributes: ['id', 'name', 'slug'] },
      ],
    });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found.' });
    }

    return res.json({ data: comment });
  } catch (error) {
    return next(error);
  }
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const rawProductId = req.body.productId;
    const productId = typeof rawProductId === 'undefined' ? null : parseInt(rawProductId, 10);
    const { topic, body } = req.body;

    if (!body) {
      return res.status(400).json({ message: 'Comment body is required.' });
    }

    if (!Number.isNaN(productId) && productId !== null) {
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found.' });
      }
    }

    const comment = await Comment.create({
      user_id: req.session.user_id,
      product_id: Number.isNaN(productId) ? null : productId,
      topic,
      body,
    });

    return res.status(201).json({ data: comment });
  } catch (error) {
    return next(error);
  }
});

router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const { topic, body, status } = req.body;
    const comment = await Comment.findByPk(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found.' });
    }

    if (comment.user_id !== req.session.user_id) {
      return res
        .status(403)
        .json({ message: 'You do not have permission to update this comment.' });
    }

    const nextStatus = ALLOWED_STATUSES.includes(status) ? status : comment.status;

    await comment.update({
      topic: typeof topic === 'undefined' ? comment.topic : topic,
      body: body || comment.body,
      status: nextStatus,
    });

    return res.json({ data: comment });
  } catch (error) {
    return next(error);
  }
});

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const comment = await Comment.findByPk(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found.' });
    }

    if (comment.user_id !== req.session.user_id) {
      return res
        .status(403)
        .json({ message: 'You do not have permission to delete this comment.' });
    }

    await comment.destroy();
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
