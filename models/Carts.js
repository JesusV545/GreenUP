const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class CartItem extends Model {}

CartItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'order',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'product',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
      },
    },
    unit_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    line_total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: 'cart_item',
    hooks: {
      beforeValidate: (item) => {
        if (item.unit_price == null) {
          throw new Error('Cart items require a unit price snapshot.');
        }
      },
      beforeSave: (item) => {
        const unitPrice = Number.parseFloat(item.unit_price);
        const quantity = Number.parseInt(item.quantity, 10) || 0;
        const total = Number.isNaN(unitPrice) ? 0 : unitPrice * quantity;
        item.line_total = total.toFixed(2);
      },
    },
  }
);

module.exports = CartItem;
