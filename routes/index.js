"use strict";

const express = require("express");
const movementCtrl = require("../controllers/movement");
const categoryCtrl = require("../controllers/category");
const userCtrl = require("../controllers/user");
const auth = require("../middlewares/auth");
const api = express.Router();

api.delete("/movement/:movementId", auth, movementCtrl.deleteMovement);
api.get("/movement", auth, movementCtrl.getMovements);
api.get("/movement/:movementId", movementCtrl.getMovement);
api.post("/movement", auth, movementCtrl.saveMovement);
api.put("/movement/:movementId", auth, movementCtrl.updateMovement);

api.delete("/category", auth, categoryCtrl.deleteCategory);
api.get("/category", auth, categoryCtrl.getCategories);
api.post("/category", auth, categoryCtrl.addCategory);
api.post("/category", auth, categoryCtrl.updateCategory);

api.delete("/deleteuser/:userId", auth, userCtrl.deleteUser);
api.get("/hasauth", auth, userCtrl.checkAuth);
api.post("/signin", userCtrl.signIn);
api.post("/signup", userCtrl.signUp);
api.post("/upload", auth, userCtrl.uploadData);
api.put("/updateuser", auth, userCtrl.updateUser);

api.post("/replacepassword", userCtrl.replacePassword);
api.post("/resetpassword", userCtrl.reqResetPassword);

module.exports = api;
