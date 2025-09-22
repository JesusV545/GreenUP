#!/usr/bin/env node
const path = require('path');
const { Umzug, SequelizeStorage } = require('umzug');
const { sequelize } = require('../config/connection');
const { Sequelize } = require('sequelize');

const command = process.argv[2] || 'up';

const umzug = new Umzug({
  migrations: {
    glob: path.join(__dirname, 'migrations', '*.js'),
    resolve: ({ name, path: migrationPath, context }) => {
      const migration = require(migrationPath);
      return {
        name,
        up: async () => migration.up({ context, Sequelize }),
        down: async () => migration.down({ context }),
      };
    },
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  logger: console,
});

const run = async () => {
  try {
    await sequelize.authenticate();

    switch (command) {
      case 'up':
        await umzug.up();
        console.log('Migrations applied.');
        break;
      case 'down':
        await umzug.down({ step: 1 });
        console.log('Last migration reverted.');
        break;
      case 'status':
        const executed = await umzug.executed();
        const pending = await umzug.pending();
        console.log(
          'Executed migrations:',
          executed.map((m) => m.name)
        );
        console.log(
          'Pending migrations:',
          pending.map((m) => m.name)
        );
        break;
      default:
        console.error(`Unknown command: ${command}`);
        process.exitCode = 1;
    }
  } catch (error) {
    console.error('Migration error:', error);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
};

run();
