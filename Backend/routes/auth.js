/*-------------------------------------------Les routes destinées à gérer l'authentification--------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------*/
//Ces routes vont permettre à l'utilisateur de créer son compte et de se connecter à l'application.

/*********************************************Appel des package et controllers nécessaires*********************************************/

const express = require('express'); //Package express pour créer le routeur
const authCtrl = require('../controllers/auth'); //Controllers applicables à l'authentification, contenant la logique de fonctionnement

/**********************************************************Création du routeur*********************************************************/

const router = express.Router();

/************************************Les routes permettant d'appliquer la logique de fonctionnement************************************/

router.post('/signup', authCtrl.signupUser); //Inscription d'un utilisateur
router.post('/login', authCtrl.loginUser); //Connexion de l'utilisateur

/****************************Export du router pour utilisation dans le fichier principal de l'application*****************************/

module.exports = router;