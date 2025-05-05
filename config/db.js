const knex = require('knex');
const path = require('path');

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: path.join(__dirname, '../sqlite3/database.sqlite3')
  },
  useNullAsDefault: true
});

// Création des tables si elles n'existent pas
async function initializeDatabase() {
  // Table des utilisateurs
  const hasUsers = await db.schema.hasTable('users');
  if (!hasUsers) {
    await db.schema.createTable('users', (table) => {
      table.increments('id').primary();
      table.string('username', 30).notNullable().unique();
      table.string('password').notNullable();
    });
  }
  // Table des tâches
  const hasTodos = await db.schema.hasTable('todos');
  if (!hasTodos) {
    await db.schema.createTable('todos', (table) => {
      table.increments('id').primary();
      table.string('title').notNullable();
      table.string('description').notNullable();
      table.string('dueDate').notNullable(); // Chaîne de date ISO
      table.enu('statut', ['pending', 'done']).notNullable().defaultTo('pending');
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    });
  }
}

initializeDatabase();

module.exports = db;