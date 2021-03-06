"use strict";

const Movement = require("../models/movement");
const Category = require("../models/category");

function getMovement(req, res) {
  const movementId = req.params.movementId;

  Movement.findById(movementId, (err, movement) => {
    if (err) {
      return res.status(500).send({ message: `Request error: ${err}` });
    }
    if (!movement) {
      return res.status(404).send({ message: "Movement doesnt exists" });
    }
    res.status(200).send({ movement });
  });
}

function getMovements(req, res) {
  Movement.find({ author: req.user.userId }, (err, movements) => {
    if (err) {
      return res
        .status(500)
        .send({ message: `Error with the request: ${err}` });
    }
    if (!movements) {
      return res.status(404).send({ message: "There are no movements" });
    }
    res.send(200, { movements });
  });
}

function saveMovement(req, res) {
  Category.findById(req.body.category, (err, cat) => {
    if (err) {
      res.status(500).send({ message: `Error saving the movement: ${err}` });
    } else {
      const movement = new Movement({
        author: req.user.userId,
        amount: req.body.amount,
        description: req.body.description,
        category: cat,
        date: req.body.date
      });

      movement.save((err, movement) => {
        if (err) {
          res
            .status(500)
            .send({ message: `Error saving in the database: ${err} ` });
        } else {
          res.status(200).send({ movement });
        }
      });
    }
  });
}

function updateMovement(req, res) {
  const movementId = req.params.movementId;
  const update = req.body;

  Movement.findByIdAndUpdate(
    movementId,
    update,
    { new: true },
    (err, movement) => {
      if (err) {
        res.status(500).send({ message: `Error updating movement: ${err}` });
      } else {
        res.status(200).send({ movement });
      }
    }
  );
}

function deleteMovement(req, res) {
  const movementId = req.params.movementId;

  Movement.findById(movementId, (err, movement) => {
    if (err) {
      res.status(500).send({ message: `Error deleting movement: ${err}` });
    } else {
      movement.remove(err => {
        if (err) {
          res.status(500).send({ message: `Error deleting movement: ${err}` });
        } else {
          res.status(200).send({ message: "Movement deleted" });
        }
      });
    }
  });
}

module.exports = {
  getMovement,
  getMovements,
  saveMovement,
  updateMovement,
  deleteMovement
};
