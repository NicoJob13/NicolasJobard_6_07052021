/*------------------------------------------Les controllers destinés à la gestion des sauces--------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------*/
//Ces controllers contiennent les logiques permettant de créer, modifier, supprimer, afficher, liker ou disliker les sauces.

/***********************************************Appel des packages et schema nécessaires***********************************************/

const Sauce = require('../models/sauce'); //Schéma de création d'une sauce
const fs = require('fs'); //Package de gestion des fichiers

/*************************************************Controllers d'affichage de sauce(s)**************************************************/
//Utilisation des méthodes find()/findOne() pour trouver toutes/une sauce.

//Trouver une sauce : permet d'afficher la fiche d'une sauce donnée
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
    .then(sauce => {//En cas de réussite
        res.status(200).json(sauce); //Retourne l'objet
        next();
    })
    .catch(error => res.status(404).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
};

//Trouver toutes les sauces : permet d'afficher la liste de toutes les sauces
 exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => {//En cas de réussite
            res.status(200).json(sauces); //Retourne les objets
            next();
        })
        .catch(error => res.status(400).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
};

/****************************************************Controller de création de sauce***************************************************/

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce); /*Analyse de l'objet sauce de la requête pour obtenir un objet utilisable dans
    lequel on pourra ajouter le fichier image*/
    delete sauceObject._id; //Suppression du champ 'id' généré par le frontend du corps de la requête
    const sauce = new Sauce({ //Création d'un objet à partir du schéma 'Sauce'
        ...sauceObject, //Utilisation de l'opérateur spread pour copier tous les éléments de req.body
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` /*Résolution de l'Url de l'image
        (protocole/hôte/dossier/nom du fichier)*/
    });
    sauce.save() //Sauvegarde de l'objet dans la base de données
        .then(() => {//En cas de réussite
            res.status(201).json({ message: 'Nouvelle sauce enregistrée' }); //Message de réussite dans la console
            next();
        })
        .catch(() => res.status(400).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
};

/***************************************************Controller de modification de sauce************************************************/
//Utilise la méthode 'updateOne' appliquée au modèle Sauce

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? //Utilisation de l'opérateur ternaire
        {//Si on modifie l'image
            ...JSON.parse(req.body.sauce), /*Analyse de l'objet sauce de la requête pour obtenir un objet utilisable dans
            lequel on pourra ajouter le fichier image*/
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` //Résolution de l'Url de l'image
        } : { ...req.body }; //Si on ne modifie pas l'image on prend uniquement les information du body
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) /*Modifie l'objet d'id passée en 1er argument avec
    les informations de celui passé en 2nd argument en récupérant l'objet qui est dans le corps de la requête avec le spread*/
        .then(() => {//En cas de réussite
            res.status(200).json({ message: 'Sauce modifiée' }); //Message de réussite dans la console
            next();
        })
        .catch(error => res.status(400).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
};

/***************************************************Controller de suppression de sauce*************************************************/
//Trouve la sauce via son id, supprime l'image associée du serveur puis l'entrée dans la base de données.

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id}) //Trouve la sauce
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images')[1]; //Récupère le nom du fichier image à partir de son Url
            fs.unlink(`images/${filename}`, () => {//Supprime l'image du dossier 'images' du serveur
                Sauce.deleteOne({ _id: req.params.id }) //Supprime l'entrée dans la base
                    .then(() => {//En cas de réussite
                        res.status(200).json({ message: 'Sauce supprimée' }); //Message de réussite dans la console
                        next();
                    })
                    .catch(error => res.status(400).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
            });
        })
        .catch(error => res.status(500).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
};

/***************************************************Controller de like/dislike de sauce************************************************/
//Permet à l'utilisateur connecté de dire s'il aime ou n'aime pas la sauce

exports.likingSauce = (req, res, next) => {
    const likingValue = req.body.like; //Récupération de la valeur de 'like' renvoyée par le frontend
    const userId = req.body.userId; //Récupération de l'id de l'utilisateur connecté
    const sauceObjectId = req.params.id; //Récupération de l'identifiant de la sauce
    
    switch (likingValue) {//En fonction de la valeur renvoyée par le frontend on modifie l'objet Sauce concerné dans la base
        case 1: //L'utilisateur aime la sauce
            Sauce.updateOne({ _id: sauceObjectId }, {$inc: {likes: +1}, $push: {usersLiked: userId}})
                .then(() => {
                    res.status(200).json({ message: 'Avis positif ajouté' }); //Statut et message de réussite de l'action
                    console.log('Avis positif ajouté'); //On retourne aussi le message dans la console
                    next();
                })
                .catch(error => res.status(400).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
            break;

        case -1: //L'utilisateur n'aime pas la sauce
            Sauce.updateOne({ _id: sauceObjectId }, {$inc: {dislikes: +1}, $push: {usersDisliked: userId}})
                .then(() => {
                    res.status(200).json({ message: 'Avis négatif ajouté' }); //Statut et message de réussite de l'action
                    console.log('Avis négatif ajouté'); //On retourne aussi le message dans la console
                    next();
                })
                .catch(error => res.status(400).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
            break;
        
        case 0: //L'utilisateur annule son vote
            Sauce.findOne({ _id: sauceObjectId }) //On retrouve l'objet par son identifiant pour accéder à ses propriétés
                .then(sauce => {
                    const usersLiked = sauce.usersLiked;
                    const usersDisliked = sauce.usersDisliked;
                    
                    if(usersLiked.includes(userId)) {//L'avis était positif : décrémente likes d'1, supprime le userId de usersLiked
                        Sauce.updateOne({ _id: sauceObjectId }, {$inc: {likes: -1}, $pull: {usersLiked: userId}})
                            .then(() => {
                                res.status(200).json({ message: 'Avis positif annulé' }); //Statut et message de réussite de l'action
                                console.log('Avis positif annulé'); //On retourne aussi le message dans la console
                                next();
                            })
                            .catch(error => res.status(400).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
                    }

                    if(usersDisliked.includes(userId)) {//L'avis était négatif : décrémente dislikes d'1, supprime le userId de usersDisliked
                        Sauce.updateOne({ _id: sauceObjectId }, {$inc: {dislikes: -1}, $pull: {usersDisliked: userId}})
                            .then(() => {
                                res.status(200).json({ message: 'Avis négatif annulé' }); //Statut et message de réussite de l'action
                                console.log('Avis négatif annulé'); //On retourne aussi le message dans la console
                                next();
                            })
                            .catch(error => res.status(400).json({ error })); //En cas d'erreur on retourne un statut d'erreur et l'erreur
                    } 
                })
                .catch(error => res.status(500).json({ error }));
            break;
    }
};