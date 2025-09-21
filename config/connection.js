const { Sequelize } = require('sequelize');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

const buildOptions = () => {
  const options = {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    dialect: 'mysql',
    logging: false,
    pool: {
      max: Number(process.env.DB_POOL_MAX || 5),
      min: Number(process.env.DB_POOL_MIN || 0),
      acquire: Number(process.env.DB_POOL_ACQUIRE || 30000),
      idle: Number(process.env.DB_POOL_IDLE || 10000),
    },
    dialectOptions: {},
  };

  if (isProduction && process.env.DB_SSL === 'true') {
    options.dialectOptions.ssl = {
      require: true,
      rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true',
    };
  }

  return options;
};

let sequelize;

if (process.env.JAWSDB_URL) {
  const options = buildOptions();
  sequelize = new Sequelize(process.env.JAWSDB_URL, options);
} else {
  const options = buildOptions();
  sequelize = new Sequelize({
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ...options,
  });
}

module.exports = sequelize;
