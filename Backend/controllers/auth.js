/*-----------------------------------Les controllers destinés à l'authentification d'un utilisateur-------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------*/

/***********************************************Appel des packages et schema nécessaires***********************************************/

const bcrypt = require('bcrypt'); //Package pour chiffrement du mot de passe
const cryptojs = require ('crypto-js'); //Package pour encodage de l'adresse e-mail
const jwt = require('jsonwebtoken'); //Package pour création de token d'identification
const User = require('../models/user'); //Schéma de création d'un utilisateur 

/***********************************************Controller de création de l'utilisateur***********************************************/

exports.signupUser = (req, res, next) => {
    //Récupération des information saisies dans les champs de formulaire
    const userEmail = req.body.email;
    const userPassword = req.body.password;
    
    //Expressions régulières à vérifier pour l'e-mail et le mot de passe afin d'éviter les attaques
    const emailSchema = /^[A-z0-9._-]+[@][a-zA-Z0-9._-]+[.][A-z]{2,}$/;
    const passwordSchema = /^(?=.*?[0-9])(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[_!@#$£µ=§%^&*?-\\/\\]).{8,}$/;
    
    //Condition de création de l'utilisateur
    if(userPassword.match(passwordSchema) && userEmail.match(emailSchema)) {//Si les 2 expressions sont vérifiées
        const encodedUserEmail = cryptojs.enc.Base64.stringify(cryptojs.enc.Utf8.parse(userEmail)); //Encodage de l'e-mail
        bcrypt.hash(userPassword, 10) //Hash du mot de passe par bcrypt avec 10 passes
            .then(hash => {//En cas de réussite
                const user = new User({//Création d'un nouvel utilisateur
                    email: encodedUserEmail,
                    password: hash
                });
                user.save() //Sauvegarde de l'utilisateur dans la base
                    .then(() => {//En cas de réussite
                        res.status(201).json({ message: 'Nouvel utilisateur enregistré' }); //Statut et message de réussite
                        next();
                    })
                    .catch(() => res.status(400).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
            })
            .catch(error => res.status(500).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
    } else {//Si au moins l'une des expressions régulières n'est pas vérifiée
        throw new Error("L'adresse ou le mot de passe ne correspond pas à un format valide."); //On retourne le message dans la console
    }
};

/***********************************************Controller de connexion de l'utilisateur**********************************************/

exports.loginUser = (req, res, next) => {
    //Récupération des information saisies dans les champs de formulaire
    const userPassword = req.body.password;
    const userEmail = req.body.email;
    const encodedUserEmail = cryptojs.enc.Base64.stringify(cryptojs.enc.Utf8.parse(userEmail)); //Encodage l'adresse e-mail saisie
    //Recherche de l'utilisateur dans la base par correspondance des adresses saisie/enregistrée dans la base
    User.findOne({ email: encodedUserEmail })
        .then(user => {
            if(!user) {//Si aucune correspondance n'est trouvée
                return res.status(401).json({ error: 'Utilisateur non trouvé' });
            }
            bcrypt.compare(userPassword, user.password) //Sinon on compare les mots de passe saisi/enregistré dans la base
                .then(valid => {
                    if(!valid) {//S'ils ne correspondent pas
                        return res.status(401).json({ error: 'Mot de passe incorrect' });
                    }
                    res.status(200).json({ //S'ils correspondent la réponse contient :
                        userId: user._id, //le userId,
                        token: jwt.sign( //un token d'authentification encodé
                            { userId: user._id }, //contenant lui-même le userId,
                            'RANDOM_TOKEN_SECRET', //la clé d'encodage,
                            { expiresIn: '24h' } //la durée de validité du token
                        )
                    });
                    next();
                })
                .catch(error => res.status(500).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
        })
        .catch(error => res.status(500).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
};