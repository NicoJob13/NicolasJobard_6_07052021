const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const User = require('./models/User');
const Sauce = require('./models/Sauce');

const app = express();

mongoose.connect('mongodb+srv://OCP6_User:Sushi-2021@ocp6cluster.4xhys.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

app.post('/api/auth/signup', (req, res, next) => {
    delete req.body._id;
    const user = new User({
        ...req.body
    });
    user.save()
        .then(() => res.status(201).json({ message: 'Nouvel utilisateur enregistré' }))
        .catch(() => res.status(400).json({ error }));
    next();
});

app.post('/api/auth/login', (req, res, next) => {
    next();
});

app.get('/api/sauces/:id', (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
    next();
});

app.get('/api/sauces', (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
    next();
});

app.post('/api/sauces', (req, res, next) => {
    delete req.body._id;
    const sauce = new Sauce({
        ...req.body
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Nouvelle sauce enregistrée' }))
        .catch(() => res.status(400).json({ error }));
    next();
});

app.put('/api/sauces/:id', (req, res, next) => {
    Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifiée' }))
        .catch(error => res.status(400).json({ error }));
    next();
});

app.delete('/api/sauces/:id', (req, res, next) => {
    Sauce.deleteOne({ _id: req.params.id})
        .then(() => res.status(200).json({ message: 'Sauce supprimée' }))
        .catch(error => res.status(400).json({ error }));
    next();
});

/*app.post('/api/sauces/:id/like', (req, res, next) => {
    next();
});*/

module.exports = app;
