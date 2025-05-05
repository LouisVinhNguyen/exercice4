// Contrôleur pour la gestion des utilisateurs (inscription, connexion, profil)
const { validationResult, matchedData } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { SECRET_KEY } = require('../config/auth');

// Inscription d'un nouvel utilisateur
async function signup(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { username, password } = matchedData(req);
  try {
    // Vérifie si l'utilisateur existe déjà
    const user = await db('users').where({ username }).first();
    if (user) {
      return res.status(409).json({ message: 'Nom d’utilisateur déjà utilisé.' });
    }
    // Hache le mot de passe avant l'insertion
    const hashedPassword = await bcrypt.hash(password, 10);
    await db('users').insert({ username, password: hashedPassword });
    return res.status(201).json({ message: 'Utilisateur créé.' });
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
}

// Authentification d'un utilisateur et génération d'un token JWT
async function login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { username, password } = matchedData(req);
  try {
    const user = await db('users').where({ username }).first();
    if (!user) {
      return res.status(401).json({ message: 'Identifiants invalides.' });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: 'Identifiants invalides.' });
    }
    // Génère un token JWT pour l'utilisateur authentifié
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '2h' });
    return res.json({ token });
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
}

// Récupère le profil de l'utilisateur authentifié
async function profile(req, res) {
  try {
    const user = await db('users').where({ id: req.user.id }).select('id', 'username').first();
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
}

module.exports = { signup, login, profile };
