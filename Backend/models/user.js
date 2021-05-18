/*--------------------------------------------------Schéma applicable à l'objet 'user'--------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------*/
//Ce schéma permet de créer un modèle précis applicable à chaque création (inscription) d'un utilisateur

/****************************************************Appel des packages nécessaires****************************************************/

const mongoose = require('mongoose'); //Package mongoose
const uniqueValidator = require('mongoose-unique-validator'); //Package destiné à s'assurer de l'unicité du compte

/**********************************************************Création du schéma**********************************************************/
//Utilisation de la méthode 'Schema' de mongoose

const userSchema = mongoose.Schema({ //On spécifie les champs souhaités dans l'objet avec leurs attributs
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator); //Application du plugin assurant l'unicité, au schéma

/***********************Export du modèle avec un nom, 'User', pour le rendre utilisable dans les autres fichiers***********************/

module.exports = mongoose.model('User', userSchema);