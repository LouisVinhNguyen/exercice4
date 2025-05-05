const express = require("express");

// Importation des routes
const authRoutes = require('./routes/authRoutes');
const todosRoutes = require('./routes/todosRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Routes de l'API
app.use('/auth', authRoutes);
app.use('/todos', todosRoutes);

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
