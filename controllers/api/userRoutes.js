const router = require('express').Router();
const { User } = require('../../models');

const sanitizeUser = (user) => {
  const plain = user.get({ plain: true });
  delete plain.password;
  return plain;
};

const isValidEmail = (value) =>
  typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const isValidName = (value) => typeof value === 'string' && value.trim().length >= 2;

const isValidPassword = (value) =>
  typeof value === 'string' &&
  value.length >= 8 &&
  /[A-Z]/.test(value) &&
  /[a-z]/.test(value) &&
  /[0-9]/.test(value);

const ATTEMPT_WINDOW_MS = Number(process.env.AUTH_WINDOW_MS || 15 * 60 * 1000);
const MAX_ATTEMPTS = Number(process.env.AUTH_MAX_ATTEMPTS || 5);
const attempts = new Map();

const getAttemptBucket = (key) => {
  const now = Date.now();
  const bucket = attempts.get(key);

  if (!bucket || now - bucket.firstAttempt > ATTEMPT_WINDOW_MS) {
    const fresh = { firstAttempt: now, count: 0 };
    attempts.set(key, fresh);
    return fresh;
  }

  return bucket;
};

const recordFailure = (key) => {
  const bucket = getAttemptBucket(key);
  bucket.count += 1;
};

const resetFailures = (key) => {
  attempts.delete(key);
};

const throttle = (req, res, next) => {
  const key = `${req.ip}:${req.body?.email || 'anonymous'}`;
  const bucket = getAttemptBucket(key);

  if (bucket.count >= MAX_ATTEMPTS) {
    return res.status(429).json({
      message: 'Too many attempts. Please wait a few minutes and try again.',
    });
  }

  res.locals.rateLimitKey = key;
  return next();
};

router.post('/', async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};

    if (!isValidName(name) || !isValidEmail(email) || !isValidPassword(password)) {
      return res.status(400).json({
        message:
          'Name (2+ chars), valid email, and a strong password (8+ chars, upper, lower, number) are required.',
      });
    }

    const existingUser = await User.findOne({ where: { email: email.trim() } });
    if (existingUser) {
      return res.status(409).json({ message: 'An account with that email already exists.' });
    }

    const newUser = await User.create({
      name: name.trim(),
      email: email.trim(),
      password,
    });

    req.session.regenerate((regenerateErr) => {
      if (regenerateErr) {
        return next(regenerateErr);
      }

      req.session.user_id = newUser.id;
      req.session.logged_in = true;

      return req.session.save((saveErr) => {
        if (saveErr) {
          return next(saveErr);
        }
        return res.status(201).json({ user: sanitizeUser(newUser) });
      });
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/login', throttle, async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (!isValidEmail(email) || typeof password !== 'string') {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const rateLimitKey = res.locals.rateLimitKey;

    const userData = await User.findOne({ where: { email: email.trim() } });

    if (!userData) {
      recordFailure(rateLimitKey);
      return res.status(401).json({ message: 'Incorrect email or password.' });
    }

    const validPassword = await userData.checkPassword(password);

    if (!validPassword) {
      recordFailure(rateLimitKey);
      return res.status(401).json({ message: 'Incorrect email or password.' });
    }

    resetFailures(rateLimitKey);

    req.session.regenerate((regenerateErr) => {
      if (regenerateErr) {
        return next(regenerateErr);
      }

      req.session.user_id = userData.id;
      req.session.logged_in = true;

      return req.session.save((saveErr) => {
        if (saveErr) {
          return next(saveErr);
        }
        return res.json({ user: sanitizeUser(userData), message: 'You are now logged in!' });
      });
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/logout', (req, res, next) => {
  if (!req.session.logged_in) {
    return res.status(204).end();
  }

  return req.session.destroy((destroyErr) => {
    if (destroyErr) {
      return next(destroyErr);
    }
    return res.status(204).end();
  });
});

module.exports = router;
