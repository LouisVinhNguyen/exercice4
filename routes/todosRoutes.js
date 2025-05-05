const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const todosController = require('../controllers/todosController');
const { body } = require('express-validator');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

// Route pour lister toutes les tâches de l'utilisateur connecté (filtrage possible par statut)
router.get('/', verifyToken, todosController.listTodos);

// Route pour exporter les tâches de l'utilisateur en CSV
router.get('/export', verifyToken, todosController.exportTodos);

// Route pour importer des tâches via un fichier CSV
router.post('/import', upload.single('file'), verifyToken, todosController.importTodos);

// Route pour obtenir une tâche par son identifiant
router.get('/:id', verifyToken, todosController.getTodoById);

// Route pour créer une nouvelle tâche
router.post('/',
  verifyToken,
  body('title').isString().notEmpty(),
  body('description').isString().notEmpty(),
  body('dueDate').isISO8601(),
  todosController.createTodo
);

// Route pour mettre à jour une tâche existante
router.put('/:id',
  verifyToken,
  body('title').optional().isString(),
  body('description').optional().isString(),
  body('dueDate').optional().isISO8601(),
  body('statut').optional().isIn(['pending', 'done']),
  todosController.updateTodo
);

// Route pour supprimer une tâche
router.delete('/:id', verifyToken, todosController.deleteTodo);

module.exports = router;
