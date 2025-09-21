const User = require('./User');
const Product = require('./Product');
const Order = require('./Order');
const Carts = require('./Carts');
const Comment = require('./Comment');

Order.belongsToMany(Product, { through: Carts, foreignKey: 'order_id', otherKey: 'product_id' });
Product.belongsToMany(Order, { through: Carts, foreignKey: 'product_id', otherKey: 'order_id' });

User.hasOne(Order, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});
Order.belongsTo(User, {
  foreignKey: 'user_id',
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

module.exports = { User, Product, Carts, Order, Comment };
