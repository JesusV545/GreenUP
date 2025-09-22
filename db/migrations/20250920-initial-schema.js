'use strict';

module.exports = {
  up: async ({ context: queryInterface, Sequelize }) => {
    await queryInterface.createTable('user', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      name: { allowNull: false, type: Sequelize.STRING },
      email: { allowNull: false, type: Sequelize.STRING, unique: true },
      password: { allowNull: false, type: Sequelize.STRING },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.createTable('product', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      name: { allowNull: false, type: Sequelize.STRING, unique: true },
      slug: { allowNull: false, type: Sequelize.STRING, unique: true },
      price: { allowNull: false, type: Sequelize.DECIMAL(10, 2) },
      inventory: { allowNull: false, defaultValue: 0, type: Sequelize.INTEGER },
      imageURL: { type: Sequelize.STRING },
      category: { allowNull: false, type: Sequelize.STRING },
      nutritionFactsURL: { type: Sequelize.STRING },
      description: { type: Sequelize.TEXT },
      isActive: { allowNull: false, defaultValue: true, type: Sequelize.BOOLEAN },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.createTable('order', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      order_number: { allowNull: false, type: Sequelize.STRING, unique: true },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'user', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM('pending', 'processing', 'fulfilled', 'cancelled'),
        defaultValue: 'pending',
      },
      subtotal: { allowNull: false, defaultValue: 0, type: Sequelize.DECIMAL(10, 2) },
      tax_total: { allowNull: false, defaultValue: 0, type: Sequelize.DECIMAL(10, 2) },
      grand_total: { allowNull: false, defaultValue: 0, type: Sequelize.DECIMAL(10, 2) },
      placed_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.createTable('cart_item', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      order_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'order', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      product_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'product', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      quantity: { allowNull: false, defaultValue: 1, type: Sequelize.INTEGER },
      unit_price: { allowNull: false, type: Sequelize.DECIMAL(10, 2) },
      line_total: { allowNull: false, defaultValue: 0, type: Sequelize.DECIMAL(10, 2) },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.createTable('comment', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'user', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      product_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: { model: 'product', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      topic: { type: Sequelize.STRING(120) },
      body: { allowNull: false, type: Sequelize.TEXT },
      status: {
        allowNull: false,
        type: Sequelize.ENUM('visible', 'hidden', 'flagged'),
        defaultValue: 'visible',
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('product', ['slug']);
    await queryInterface.addIndex('cart_item', ['order_id']);
    await queryInterface.addIndex('cart_item', ['product_id']);
    await queryInterface.addIndex('comment', ['product_id']);
    await queryInterface.addIndex('comment', ['status']);
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('comment');
    await queryInterface.dropTable('cart_item');
    await queryInterface.dropTable('order');
    await queryInterface.dropTable('product');
    await queryInterface.dropTable('user');
  },
};
