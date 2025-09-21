const User = require('./User');
const Product = require('./Product');
const Order = require('./Order.js');
const Carts = require('./Carts');
const Comment = require('./Comment');

Order.belongsToMany(Product, { through: Carts });
Product.belongsToMany(Order, { through: Carts });

User.hasOne(Order, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});

User.hasMany(Comment, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});

Product.hasMany(Comment, {
  foreignKey: 'product_id',
  onDelete: 'CASCADE',
});

Comment.belongsTo(User);
Comment.belongsTo(Product);

module.exports = { User, Product, Carts, Order, Comment };
//god i hate this
