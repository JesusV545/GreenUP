const { Model } = require('sequelize');
const sequelize = require('../config/connection');

class Carts extends Model {}

Carts.init(
  {},
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'carts',
  }
);

module.exports = Carts;
