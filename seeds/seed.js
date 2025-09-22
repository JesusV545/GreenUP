const slugify = (value) =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const { sequelize } = require('../config/connection');
const { User, Product, Order, CartItem, Comment } = require('../models');
const userData = require('./userData.json');
const productData = require('./productData.json');

const args = process.argv.slice(2);
const onlyArg = args.find((arg) => arg.startsWith('--only='));
const targets = onlyArg
  ? onlyArg
      .replace('--only=', '')
      .split(',')
      .map((target) => target.trim().toLowerCase())
      .filter(Boolean)
  : [];
const shouldSeed = (key) => targets.length === 0 || targets.includes(key);
const forceSync = args.includes('--force');

const log = (...messages) => console.log('[seed]', ...messages);

const orderSeeds = [
  {
    order_number: 'ORD-1001',
    userEmail: 'tim@email.com',
    status: 'fulfilled',
    taxRate: 0.08,
    items: [
      { slug: 'honeycrisp-apple', quantity: 3 },
      { slug: 'bell-pepper', quantity: 2 },
    ],
  },
  {
    order_number: 'ORD-1002',
    userEmail: 'andrew@email.com',
    status: 'processing',
    taxRate: 0.08,
    items: [
      { slug: 'watermelon-seedless', quantity: 1 },
      { slug: 'grapes', quantity: 2 },
    ],
  },
];

const commentSeeds = [
  {
    userEmail: 'tim@email.com',
    productSlug: 'honeycrisp-apple',
    topic: 'Favorite Snack',
    body: 'Sweet and crunchy�especially good when chilled!',
    status: 'visible',
  },
  {
    userEmail: 'andrew@email.com',
    productSlug: 'watermelon-seedless',
    topic: 'Summer Picnic Win',
    body: 'Arrived perfectly ripe and was a hit at the BBQ.',
    status: 'visible',
  },
  {
    userEmail: 'jesus@email.com',
    productSlug: null,
    topic: 'Site Feedback',
    body: 'Would love to see bundle deals for weekly meal prep!',
    status: 'visible',
  },
];

const seedUsers = async () => {
  if (!shouldSeed('users')) return;

  for (const entry of userData) {
    const email = entry.email.toLowerCase();
    const [user, created] = await User.findOrCreate({
      where: { email },
      defaults: {
        name: entry.name.trim(),
        password: entry.password,
      },
    });

    if (!created && user.name !== entry.name.trim()) {
      await user.update({ name: entry.name.trim() });
    }
  }

  log('Seeded users');
};

const seedProducts = async () => {
  if (!shouldSeed('products')) return;

  for (const entry of productData) {
    const slug = slugify(entry.slug || entry.name);
    const defaults = {
      ...entry,
      slug,
    };

    const [product, created] = await Product.findOrCreate({
      where: { slug },
      defaults,
    });

    if (!created) {
      await product.update(defaults);
    }
  }

  log('Seeded products');
};

const seedOrders = async () => {
  if (!shouldSeed('orders')) return;

  await CartItem.destroy({ where: {} });
  await Order.destroy({ where: {} });

  const users = await User.findAll();
  const products = await Product.findAll();

  const userByEmail = new Map(users.map((user) => [user.email.toLowerCase(), user]));
  const productBySlug = new Map(products.map((product) => [product.slug, product]));

  for (const seed of orderSeeds) {
    const user = userByEmail.get(seed.userEmail.toLowerCase());
    if (!user) {
      log(`Skipping order ${seed.order_number} � user ${seed.userEmail} not found`);
      continue;
    }

    const order = await Order.create({
      order_number: seed.order_number,
      user_id: user.id,
      status: seed.status || 'pending',
    });

    let subtotal = 0;

    for (const item of seed.items) {
      const product = productBySlug.get(item.slug);
      if (!product) {
        log(`Skipping cart item for unknown product slug: ${item.slug}`);
        continue;
      }

      const quantity = item.quantity || 1;
      const unitPrice = Number.parseFloat(product.price);
      subtotal += unitPrice * quantity;

      await CartItem.create({
        order_id: order.id,
        product_id: product.id,
        quantity,
        unit_price: unitPrice,
      });
    }

    const tax = Number((subtotal * (seed.taxRate ?? 0)).toFixed(2));
    const grandTotal = Number((subtotal + tax).toFixed(2));

    await order.update({
      subtotal: subtotal.toFixed(2),
      tax_total: tax.toFixed(2),
      grand_total: grandTotal.toFixed(2),
    });
  }

  log('Seeded orders and cart items');
};

const seedComments = async () => {
  if (!shouldSeed('comments')) return;

  await Comment.destroy({ where: {} });

  const users = await User.findAll();
  const products = await Product.findAll();

  const userByEmail = new Map(users.map((user) => [user.email.toLowerCase(), user]));
  const productBySlug = new Map(products.map((product) => [product.slug, product]));

  for (const seed of commentSeeds) {
    const user = userByEmail.get(seed.userEmail.toLowerCase());
    if (!user) {
      log(`Skipping comment � user ${seed.userEmail} not found`);
      continue;
    }

    const product = seed.productSlug ? productBySlug.get(seed.productSlug) : null;

    await Comment.create({
      user_id: user.id,
      product_id: product ? product.id : null,
      topic: seed.topic,
      body: seed.body,
      status: seed.status || 'visible',
    });
  }

  log('Seeded comments');
};

const seedDatabase = async () => {
  try {
    await sequelize.sync({ force: forceSync });
    if (!forceSync) {
      await sequelize.sync();
    }

    if (shouldSeed('users')) {
      await seedUsers();
    }

    if (shouldSeed('products')) {
      await seedProducts();
    }

    if (shouldSeed('orders')) {
      await seedOrders();
    }

    if (shouldSeed('comments')) {
      await seedComments();
    }

    log('Seeding complete');
  } catch (error) {
    console.error('[seed] Failed to seed database', error);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
};

seedDatabase();
