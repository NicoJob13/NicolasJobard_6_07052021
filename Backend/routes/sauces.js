/*-----------------------------------------------Les routes destinées à gérer les sauces------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------*/
//Ces routes vont permettre à l'utilisateur d'agir sur le site : recherche, ajout, modification, suppression, liking.

/**************************************Appel des packages, controllers et middlewares nécessaires**************************************/

const express = require('express'); //Package express pour créer le routeur
const saucesCtrl = require('../controllers/sauces'); //Controllers applicables aux sauces, contenant la logique de fonctionnement
const auth = require('../middleware/auth'); //Middleware de vérification de l'authentification des requêtes
const multer = require('../middleware/multer-config'); //Middleware de configuration du package de gestion des fichiers image

/**********************************************************Création du routeur*********************************************************/

const router = express.Router();

/************************************Les routes permettant d'appliquer la logique de fonctionnement************************************/
//Toutes les routes sont protégées par le middleware de vérification de l'authentification des requêtes
//On applique le middleware de gestion des images aux routes de création et modification de sauces 

router.get('/:id', auth, saucesCtrl.getOneSauce); //Affichage d'une sauce
router.get('/', auth, saucesCtrl.getAllSauces); //Affichage de toutes les sauces
router.post('/', auth, multer, saucesCtrl.createSauce); //Création d'une sauce
router.put('/:id', auth, multer, saucesCtrl.modifySauce); //Modification d'une sauce
router.delete('/:id', auth, saucesCtrl.deleteSauce); //Suppression d'une sauce
router.post('/:id/like', auth, saucesCtrl.likingSauce); //Avis sur la sauce

/****************************Export du router pour utilisation dans le fichier principal de l'application*****************************/

module.exports = router;