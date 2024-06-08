# Application de Gestion de Dépôt Pétrolier

## Fonctionnalités

- **Gestion des Conducteurs** : Création, lecture, mise à jour et suppression (CRUD) des conducteurs.
- **Gestion des Transporteurs** : CRUD des transporteurs.
- **Gestion des Clients** : CRUD des clients.
- **Gestion des Tracteurs** : CRUD des tracteurs.
- **Gestion des Remorques** : CRUD des remorques.
- **Affectation** : Attribution des conducteurs aux transporteurs et des tracteurs aux remorques.

## Prérequis

Avant de commencer, assurez-vous d'avoir les éléments suivants installés sur votre machine :

- [Node.js (version 14.x ou plus)](https://nodejs.org/)
- [Microsoft SQL Server](https://www.microsoft.com/fr-fr/sql-server/sql-server-downloads)
- Un gestionnaire de paquets comme [npm](https://www.npmjs.com/) (installé avec Node.js) ou [Yarn](https://yarnpkg.com/)

## Installation

1. Clonez le dépôt :

    ```
    git clone https://github.com/nasreddineelmadhkour/pgs_apps.git
    cd pgs_apps
    ```

2. Installez les dépendances :

    ```
    npm install
    ```

3. Configurez la connexion à la base de données SQL Server dans le fichier `.env` :

    ```
    SQL_SERVER_CONNECTION_STRING=your_connection_string_here
    ```

4. Créez la base de données SQL Server avec le nom `depot_petrolier` et les tables nécessaires. Vous pouvez trouver les scripts de création dans le dossier `sql-scripts`.

5. Lancez l'application :

    ```
    npm start
    ```

L'application sera disponible à l'adresse `http://localhost:3000`.

## Structure du Projet

Le projet est structuré comme suit :

- `controllers` : Contient les contrôleurs pour gérer les requêtes HTTP.
- `models` : Contient les modèles pour SQL Server.
- `routes` : Contient les définitions des routes.
- `views` : Contient les vues EJS.
- `public` : Contient les fichiers statiques (CSS, JavaScript, images).

<!-- Continue with other sections like Usage, Contribution, License, Acknowledgments -->
