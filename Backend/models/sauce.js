/*--------------------------------------------------Schéma applicable à l'objet 'user'--------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------*/
//Ce schéma permet de créer un modèle précis applicable à chaque sauce

/******************************************************Appel du package nécessaire*****************************************************/

const mongoose = require('mongoose');

/**********************************************************Création du schéma**********************************************************/
//Utilisation de la méthode 'Schema' de mongoose

const sauceSchema = mongoose.Schema({//On spécifie les champs souhaités dans l'objet avec leurs attributs
    userId: { type: String, required: true }, //Identifiant de l'utilisateur créateur
    name: { type: String, required: true }, //Nom de la sauce
    manufacturer: { type: String, required: true }, //Fabricant de la sauce
    description: { type: String, required: true }, //Description de la sauce
    mainPepper: { type: String, required: true }, //Ingrédient principal
    imageUrl: { type: String, required: true }, //Url de l'image
    heat: { type: Number, required: true }, //Indicateur de 'force' de la sauce
    likes: { type: Number, default: 0 }, //Nombre de like 
    dislikes: { type: Number, default: 0 }, //Nombre de dislike
    usersLiked: { type: Array, default: [] }, //Tableau des userId des utilisateurs aimant
    usersDisliked: { type: Array, default: [] } //Tableau des userId des utilisateurs n'aimant pas
});

/***********************Export du modèle avec un nom, 'User', pour le rendre utilisable dans les autres fichiers***********************/

module.exports = mongoose.model('Sauce', sauceSchema);