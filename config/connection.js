const { Sequelize } = require('sequelize');
const pino = require('pino');
require('dotenv').config();

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport:
    process.env.NODE_ENV === 'development'
      ? { target: 'pino-pretty', options: { colorize: true } }
      : undefined,
});

const isProduction = process.env.NODE_ENV === 'production';

const buildOptions = () => {
  const options = {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    dialect: 'mysql',
    logging: process.env.DB_LOGGING === 'true' ? (msg) => logger.debug(msg) : false,
    pool: {
      max: Number(process.env.DB_POOL_MAX || 10),
      min: Number(process.env.DB_POOL_MIN || 0),
      acquire: Number(process.env.DB_POOL_ACQUIRE || 60000),
      idle: Number(process.env.DB_POOL_IDLE || 10000),
    },
    retry: {
      max: Number(process.env.DB_RETRY_MAX || 5),
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

const sequelize = process.env.JAWSDB_URL
  ? new Sequelize(process.env.JAWSDB_URL, buildOptions())
  : new Sequelize({
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      ...buildOptions(),
    });

module.exports = { sequelize, logger };
