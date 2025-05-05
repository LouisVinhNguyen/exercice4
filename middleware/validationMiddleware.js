const { validationResult } = require('express-validator');

// Middleware pour gérer les erreurs de validation provenant d'express-validator
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

module.exports = { handleValidationErrors };
