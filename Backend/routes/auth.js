const express = require('express');

const router = express.Router();

const User = require('../models/User');

router.post('/signup', (req, res, next) => {
    delete req.body._id;
    const user = new User({
        ...req.body
    });
    user.save()
        .then(() => res.status(201).json({ message: 'Nouvel utilisateur enregistré' }))
        .catch(() => res.status(400).json({ error }));
    next();
});

router.post('/login', (req, res, next) => {
    next();
});

module.exports = router;