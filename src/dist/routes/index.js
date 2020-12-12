'use strict';

var express = require('express');

var movementCtrl = require('../controllers/movement');

var categoryCtrl = require('../controllers/category');

var userCtrl = require('../controllers/user');

var auth = require('../middlewares/auth');

var api = express.Router();
api.get('/', function (req, res) {
  res.json({
    message: 'Hello there!'
  });
});
api["delete"]('/movement/:movementId', auth, movementCtrl.deleteMovement);
api.get('/movement', auth, movementCtrl.getMovements);
api.get('/movement/:movementId', movementCtrl.getMovement);
api.post('/movement', auth, movementCtrl.saveMovement);
api.put('/movement/:movementId', auth, movementCtrl.updateMovement);
api["delete"]('/category', auth, categoryCtrl.deleteCategory);
api.get('/category', auth, categoryCtrl.getCategories);
api.post('/category', auth, categoryCtrl.addCategory);
api.post('/category', auth, categoryCtrl.updateCategory);
api["delete"]('/deleteuser/:userId', auth, userCtrl.deleteUser);
api.get('/hasauth', auth, userCtrl.checkAuth);
api.post('/signin', userCtrl.signIn);
api.post('/signup', userCtrl.signUp);
api.post('/upload', auth, userCtrl.uploadData);
api.put('/updateuser', auth, userCtrl.updateUser);
api.post('/replacepassword', userCtrl.replacePassword);
api.post('/resetpassword', userCtrl.reqResetPassword);
module.exports = api;