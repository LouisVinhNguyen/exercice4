const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const authController = require('../controllers/authController');
const { body } = require('express-validator');
const router = express.Router();

// Route pour l'inscription d'un nouvel utilisateur
router.post('/signup',
  body('username').isLength({ min: 3, max: 30 }),
  body('password').isLength({ min: 8 }),
  authController.signup
);

// Route pour l'authentification d'un utilisateur
router.post('/login',
  body('username').notEmpty(),
  body('password').notEmpty(),
  authController.login
);

// Route pour obtenir le profil de l'utilisateur authentifié
router.get('/profile', verifyToken, authController.profile);

module.exports = router;
