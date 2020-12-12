"use strict";

var Movement = require("../models/movement");

var Category = require("../models/category");

function getMovement(req, res) {
  var movementId = req.params.movementId;
  Movement.findById(movementId, function (err, movement) {
    if (err) {
      return res.status(500).send({
        message: "Request error: ".concat(err)
      });
    }

    if (!movement) {
      return res.status(404).send({
        message: "Movement doesnt exists"
      });
    }

    res.status(200).send({
      movement: movement
    });
  });
}

function getMovements(req, res) {
  Movement.find({
    author: req.user.userId
  }, function (err, movements) {
    if (err) {
      return res.status(500).send({
        message: "Error with the request: ".concat(err)
      });
    }

    if (!movements) {
      return res.status(404).send({
        message: "There are no movements"
      });
    }

    res.send(200, {
      movements: movements
    });
  });
}

function saveMovement(req, res) {
  Category.findById(req.body.category, function (err, cat) {
    if (err) {
      res.status(500).send({
        message: "Error saving the movement: ".concat(err)
      });
    } else {
      var movement = new Movement({
        author: req.user.userId,
        amount: req.body.amount,
        description: req.body.description,
        category: cat,
        date: req.body.date
      });
      movement.save(function (err, movement) {
        if (err) {
          res.status(500).send({
            message: "Error saving in the database: ".concat(err, " ")
          });
        } else {
          res.status(200).send({
            movement: movement
          });
        }
      });
    }
  });
}

function updateMovement(req, res) {
  var movementId = req.params.movementId;
  var update = req.body;
  Movement.findByIdAndUpdate(movementId, update, {
    "new": true
  }, function (err, movement) {
    if (err) {
      res.status(500).send({
        message: "Error updating movement: ".concat(err)
      });
    } else {
      res.status(200).send({
        movement: movement
      });
    }
  });
}

function deleteMovement(req, res) {
  var movementId = req.params.movementId;
  Movement.findById(movementId, function (err, movement) {
    if (err) {
      res.status(500).send({
        message: "Error deleting movement: ".concat(err)
      });
    } else {
      movement.remove(function (err) {
        if (err) {
          res.status(500).send({
            message: "Error deleting movement: ".concat(err)
          });
        } else {
          res.status(200).send({
            message: "Movement deleted"
          });
        }
      });
    }
  });
}

module.exports = {
  getMovement: getMovement,
  getMovements: getMovements,
  saveMovement: saveMovement,
  updateMovement: updateMovement,
  deleteMovement: deleteMovement
};