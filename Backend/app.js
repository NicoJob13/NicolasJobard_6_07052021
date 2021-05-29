/*-------------------------------------------------Fichier principal de l'application---------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------*/

/**********************************************Appel des framework et packages nécessaires*********************************************/

const express = require('express'); //Package de création d'API
const helmet = require('helmet'); //Package de sécurisation des en-têtes
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser'); //Package d'analyse du body
const mongoose = require('mongoose'); //Package facilitant les intéractions avec la base de données
const path = require('path'); //Package permettant d'accéder au path du serveur

/****************************************************Création de l'API avec Express****************************************************/

const app = express();

/***************************************Appel des fichiers de gestion des routes de l'application**************************************/

const authRoutes = require('./routes/auth');
const saucesRoutes = require('./routes/sauces');

/***************************************Limitation du nombre de requêtes pour une même adresse IP**************************************/
//Le but est d'empêcher les attaques en force brute

const limiter = rateLimit({//Appel du package
  windowMS: 5 * 60 * 1000, //Délai de mémorisation des requêtes et de blocage après dépassement du nombre de requêtes (en millisecondes)
  max: 50, //Nombre maximum de requêtes pour une même adresse IP
  message: "Trop de requêtes effectuées avec cette adresse IP",
});

app.use(limiter); //Utilisation de la règle créée

/**************Connexion à la base MongoDB avec utilisation de variables d'environnement pour sécuriser l'accès à la base**************/

//Appel du fichier de configuration de dotenv
require('dotenv').config();

mongoose.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_CLUST}.4xhys.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`, 
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
}) //Information sur le statut de la connexion :
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

/**********************************************************Middlewares généraux********************************************************/

app.use((req, res, next) => {//Middleware destiné à éviter les erreurs de CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(helmet()); //Middleware permettant de sécuriser les en-têtes

app.use(bodyParser.json()); //Middleware permettant d'extrait l'objet JSON d'un demande

app.use('/images', express.static(path.join(__dirname, 'images'))); //Gestion du routage de la ressource 'images' en statique

app.use('/api/auth', authRoutes); //Utilisation du routeur auth pour toutes les demandes vers '/api/auth/'
app.use('/api/sauces', saucesRoutes); //Utilisation du routeur sauces pour toutes les demandes vers '/api/sauces/'

/********************************************************Export de l'application*******************************************************/

module.exports = app;