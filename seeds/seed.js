const sequelize = require('../config/connection');
const { User, Product } = require('../models');
// rename the file userDate to Data to fix line 4
const userData = require('./userDate.json');
const productData = require('./productData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  await Product.bulkCreate(productData, {
    returning: true,
  });

  process.exit(0);
};

seedDatabase();
