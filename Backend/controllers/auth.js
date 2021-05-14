const bcrypt = require('bcrypt');
const cryptojs = require ('crypto-js');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.signupUser = (req, res, next) => {
    const passwordSchema = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[.-@$!%*?&])[0-9a-zA-Z.-@$!%*?&]{12,15}$/;
    const emailSchema = /^[A-z0-9._-]+[@]{1}[a-zA-Z0-9._-]+[.]{1}[A-z]{2,}$/;
    const userPassword = req.body.password;
    const userEmail = req.body.email;
    
    if(userPassword.match(passwordSchema) && userEmail.match(emailSchema)) {
        const encodedUserEmail = cryptojs.enc.Base64.stringify(cryptojs.enc.Utf8.parse(userEmail));
        
        bcrypt.hash(userPassword, 10)
            .then(hash => {
                const user = new User({
                    email: encodedUserEmail,
                    password: hash
                });
                user.save()
                    .then(() => {
                        res.status(201).json({ message: 'Nouvel utilisateur enregistré' });
                        next();
                    })
                    .catch(() => res.status(400).json({ error }));
            })
            .catch(error => res.status(500).json({ error }));
    } else {
        throw new Error("L'adresse ou le mot de passe ne correspond pas à un format valide.")
    }
};

exports.loginUser = (req, res, next) => {
    const userPassword = req.body.password;
    const userEmail = req.body.email;
    const encodedUserEmail = cryptojs.enc.Base64.stringify(cryptojs.enc.Utf8.parse(userEmail));
    
    User.findOne({ email: encodedUserEmail })
        .then(user => {
            if(!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé' });
            }
            bcrypt.compare(userPassword, user.password)
                .then(valid => {
                    if(!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                    next();
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};