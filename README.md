# Gestionnaire de Tâches – Exercice 4

## Description

Ce projet est une API REST Node.js permettant la gestion de tâches (todos) avec authentification, validation, import/export CSV et opérations CRUD. L’application est conçue pour des usages pédagogiques et met en pratique les notions suivantes :
- Authentification JWT
- Validation des requêtes
- Téléversement et téléchargement de fichiers (CSV)
- Opérations CRUD sur les tâches
- Tests d’API

## Structure du projet

```
exercice4/
├── config/                # Configuration (base de données, clé JWT)
├── controllers/           # Logique métier (auth, todos)
├── middleware/            # Middlewares (auth, validation)
├── models/                # (Réservé pour extensions futures)
├── routes/                # Définition des routes Express
├── sqlite3/               # Base de données SQLite
├── tests/                 # Fichiers de tests d’API (REST Client)
├── package.json           # Dépendances et scripts
├── server.js              # Point d’entrée principal
└── README.md              # Ce fichier
```

## Installation

1. **Cloner le dépôt ou copier le dossier.**
2. Installer les dépendances :
   ```sh
   npm install
   ```
3. Lancer le serveur :
   ```sh
   npm run start
   ```
   Le serveur démarre sur [http://localhost:3000](http://localhost:3000).

## Base de données

- Utilise SQLite (fichier `sqlite3/database.sqlite3`).
- Les tables sont créées automatiquement au démarrage si elles n’existent pas.

## Routes de l’API

### Authentification

- `POST /auth/signup`  
  Créer un nouvel utilisateur.  
  **Body :** `{ username, password }`  
  (username : 3-30 caractères, password : min 8 caractères)

- `POST /auth/login`  
  Authentifier un utilisateur et obtenir un token JWT.  
  **Body :** `{ username, password }`

- `GET /auth/profile`  
  Récupérer le profil de l’utilisateur connecté.  
  **Header :** `Authorization: Bearer <token>`

### Gestion des tâches

- `GET /todos`  
  Lister toutes les tâches de l’utilisateur connecté.  
  **Query optionnel :** `statut=pending|done`

- `GET /todos/:id`  
  Récupérer une tâche par son identifiant.

- `POST /todos`  
  Créer une nouvelle tâche.  
  **Body :** `{ title, description, dueDate }`  
  (title et description obligatoires, dueDate au format ISO)

- `PUT /todos/:id`  
  Mettre à jour une tâche existante.  
  **Body :** `{ title?, description?, dueDate?, statut? }`

- `DELETE /todos/:id`  
  Supprimer une tâche.

- `POST /todos/import`  
  Importer des tâches via un fichier CSV.  
  **Form-data :** `file` (CSV, colonnes : title, description, dueDate, statut)

- `GET /todos/export`  
  Exporter toutes les tâches de l’utilisateur au format CSV.

**Toutes les routes /todos nécessitent un token JWT dans l’en-tête Authorization.**

## Exemple de test d’API

Des fichiers de tests sont fournis dans le dossier `tests/` (compatibles avec l’extension REST Client de VS Code) :
- `auth.http` : tests d’inscription, connexion, profil, erreurs.
- `todos.http` : tests CRUD, import/export, validation, erreurs.

## Exigences techniques

- Node.js, Express, SQLite, Knex, Multer, JWT, express-validator, csv-parser, json2csv.
- Projet structuré et modulaire.
- Validation et gestion d’erreurs robustes.

## Auteur

Louis Nguyen