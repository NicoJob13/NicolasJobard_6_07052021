const express = require('express');

const router = express.Router();

const saucesCtrl = require('../controllers/sauces');

router.get('/:id', saucesCtrl.getOneSauce);

router.get('/', saucesCtrl.getAllSauces);

router.post('/', saucesCtrl.createSauce);

router.put('/:id', saucesCtrl.modifySauce);

router.delete('/:id', saucesCtrl.deleteSauce);

router.post('/:id/like', saucesCtrl.likeSauce);

module.exports = router;