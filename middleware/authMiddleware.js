const jwt = require('jsonwebtoken');
const SECRET_KEY = require('../config/auth').SECRET_KEY;

// Middleware pour vérifier le token JWT
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "Token manquant." });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token manquant." });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token invalide ou expiré." });
    }
    req.user = decoded;
    next();
  });
}

module.exports = {
  verifyToken
};