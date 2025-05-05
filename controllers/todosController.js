// Contrôleur pour la gestion des tâches (CRUD, import/export CSV)
const { validationResult, matchedData } = require('express-validator');
const db = require('../config/db');
const csv = require('csv-parser');
const { Readable } = require('stream');
const { Parser } = require('json2csv');

// Liste toutes les tâches de l'utilisateur connecté (filtrage possible par statut)
async function listTodos(req, res) {
  const status = req.query.statut;
  try {
    let query = db('todos').where({ user_id: req.user.id });
    if (status && ['pending', 'done'].includes(status)) {
      query = query.andWhere({ statut: status });
    }
    const todos = await query.select();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
}

// Récupère une tâche par son identifiant
async function getTodoById(req, res) {
  try {
    const todo = await db('todos').where({ id: req.params.id, user_id: req.user.id }).first();
    if (!todo) return res.status(404).json({ message: 'Tâche non trouvée.' });
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
}

// Crée une nouvelle tâche pour l'utilisateur connecté
async function createTodo(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { title, description, dueDate } = matchedData(req);
  try {
    const [id] = await db('todos').insert({
      title,
      description,
      dueDate,
      statut: 'pending',
      user_id: req.user.id
    });
    res.status(201).json({ id, title, description, dueDate, statut: 'pending' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
}

// Met à jour une tâche existante de l'utilisateur connecté
async function updateTodo(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { title, description, dueDate, statut } = matchedData(req);
  try {
    const todo = await db('todos').where({ id: req.params.id, user_id: req.user.id }).first();
    if (!todo) return res.status(404).json({ message: 'Tâche non trouvée.' });
    await db('todos')
      .where({ id: req.params.id, user_id: req.user.id })
      .update({
        title: title !== undefined ? title : todo.title,
        description: description !== undefined ? description : todo.description,
        dueDate: dueDate !== undefined ? dueDate : todo.dueDate,
        statut: statut !== undefined ? statut : todo.statut
      });
    res.json({ message: 'Tâche mise à jour.' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
}

// Supprime une tâche de l'utilisateur connecté
async function deleteTodo(req, res) {
  try {
    const todo = await db('todos').where({ id: req.params.id, user_id: req.user.id }).first();
    if (!todo) return res.status(404).json({ message: 'Tâche non trouvée.' });
    await db('todos').where({ id: req.params.id, user_id: req.user.id }).del();
    res.json({ message: 'Tâche supprimée.' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
}

// Importe des tâches à partir d'un fichier CSV (une tâche par ligne)
async function importTodos(req, res) {
  if (!req.file) return res.status(400).json({ message: 'Fichier manquant.' });
  const userId = req.user.id;
  const results = [];
  try {
    // Lecture du fichier CSV depuis le buffer mémoire
    const stream = Readable.from(req.file.buffer);
    stream.pipe(csv())
      .on('data', (row) => {
        // Ajoute la tâche si les champs requis sont présents
        if (row.title && row.description && row.dueDate) {
          results.push({
            title: row.title,
            description: row.description,
            dueDate: row.dueDate,
            statut: row.statut || 'pending',
            user_id: userId
          });
        }
      })
      .on('end', async () => {
        // Insère chaque tâche dans la base de données
        for (const todo of results) {
          await db('todos').insert(todo);
        }
        res.json({ message: 'Importation terminée.', count: results.length });
      })
      .on('error', () => res.status(400).json({ message: 'Erreur de lecture du CSV.' }));
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
}

// Exporte toutes les tâches de l'utilisateur connecté au format CSV
async function exportTodos(req, res) {
  try {
    const todos = await db('todos')
      .where({ user_id: req.user.id })
      .select('title', 'description', 'dueDate', 'statut');
    const parser = new Parser({ fields: ['title', 'description', 'dueDate', 'statut'] });
    const csvData = parser.parse(todos);
    res.header('Content-Type', 'text/csv');
    res.attachment('todos.csv');
    res.send(csvData);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
}

module.exports = {
  listTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  importTodos,
  exportTodos
};
