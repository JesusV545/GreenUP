const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/connection');

class Comment extends Model {}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id',
      },
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'product',
        key: 'id',
      },
    },
    topic: {
      type: DataTypes.STRING(120),
      allowNull: true,
      validate: {
        len: [0, 120],
      },
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [1, 1000],
      },
    },
    status: {
      type: DataTypes.ENUM('visible', 'hidden', 'flagged'),
      allowNull: false,
      defaultValue: 'visible',
    },
  },
  {
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: 'comment',
  }
);

module.exports = Comment;
