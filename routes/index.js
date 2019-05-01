'use strict';

const express = require('express');
const movementCtrl = require('../controllers/movement');
const categoryCtrl = require('../controllers/category');
const userCtrl = require('../controllers/user');
const auth = require('../middlewares/auth');
const api = express.Router();

api.get('/movement', auth, movementCtrl.getMovements);
api.get('/movement/:movementId', movementCtrl.getMovement);
api.post('/movement', auth, movementCtrl.saveMovement);
api.put('/movement/:movementId', auth, movementCtrl.updateMovement);
api.delete('/movement/:movementId', auth, movementCtrl.deleteMovement);

api.post('/category', categoryCtrl.addCategory);

api.post('/signup', userCtrl.signUp);
api.post('/signin', userCtrl.signIn);
api.delete('/deleteuser', auth, userCtrl.deleteUser);
api.put('/updateuser', auth, userCtrl.updateUser);

api.post('/resetpassword', userCtrl.reqResetPassword);
api.post('/replacepassword', userCtrl.replacePassword);

api.get('/hasauth', auth)

module.exports = api;
