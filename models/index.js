const User = require('./User');
const Product = require('./Product');
const Order = require('./Order');
const CartItem = require('./Carts');
const Comment = require('./Comment');

User.hasMany(Order, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});
Order.belongsTo(User, {
  foreignKey: 'user_id',
});

Order.belongsToMany(Product, {
  through: CartItem,
  foreignKey: 'order_id',
  otherKey: 'product_id',
  as: 'products',
});
Product.belongsToMany(Order, {
  through: CartItem,
  foreignKey: 'product_id',
  otherKey: 'order_id',
  as: 'orders',
});

Order.hasMany(CartItem, {
  foreignKey: 'order_id',
  as: 'items',
  onDelete: 'CASCADE',
});
CartItem.belongsTo(Order, {
  foreignKey: 'order_id',
});

Product.hasMany(CartItem, {
  foreignKey: 'product_id',
  onDelete: 'CASCADE',
});
CartItem.belongsTo(Product, {
  foreignKey: 'product_id',
});

User.hasMany(Comment, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});
Comment.belongsTo(User, {
  foreignKey: 'user_id',
});

Product.hasMany(Comment, {
  foreignKey: 'product_id',
  onDelete: 'CASCADE',
});
Comment.belongsTo(Product, {
  foreignKey: 'product_id',
});

module.exports = { User, Product, CartItem, Order, Comment };
