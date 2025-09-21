const router = require('express').Router();
const { User } = require('../../models');

const sanitizeUser = (user) => {
  const plain = user.get({ plain: true });
  delete plain.password;
  return plain;
};

router.post('/', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const newUser = await User.create({ name, email, password });

    req.session.save(() => {
      req.session.user_id = newUser.id;
      req.session.logged_in = true;

      return res.status(201).json({ user: sanitizeUser(newUser) });
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'An account with that email already exists.' });
    }
    return next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const userData = await User.findOne({ where: { email } });

    if (!userData) {
      return res.status(401).json({ message: 'Incorrect email or password.' });
    }

    const validPassword = await userData.checkPassword(password);

    if (!validPassword) {
      return res.status(401).json({ message: 'Incorrect email or password.' });
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      return res.json({ user: sanitizeUser(userData), message: 'You are now logged in!' });
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(204).end();
  }
});

module.exports = router;
