'use strict';

const Movement = require('../models/movement');
const Category = require('../models/category');

function getMovement(req, res) {
  let movementId = req.params.movementId;

  Movement.findById(movementId, (err, movement) => {
    if (err) {
      return res
        .status(500)
        .send({ message: `Error al realizar la petición: ${err}` });
    }
    if (!movement) {
      return res.status(404).send({ message: `El movemento no existe` });
    }
    res.status(200).send({ movement });
  });
}

function getMovements(req, res) {
  Movement.find({}, (err, movements) => {
    if (err) {
      return res
        .status(500)
        .send({ message: `Error al realizar la petición: ${err}` });
    }
    if (!movements) {
      return res.status(404).send({ message: 'No existen movementos' });
    }
    res.send(200, { movements });
  });
}

function saveMovement(req, res) {
  Category.findById(req.body.category, (err, cat) => {
    if (err) {
      res.status(500).send({ message: `Error al borrar el movemento: ${err}` });
    } else {
      let movement = new Movement({
        amount: req.body.amount,
        description: req.body.description,
        category: cat,
        date: req.body.date,
        owner: req.body.email
      });

      movement.save((err, movementStored) => {
        if (err) {
          res
            .status(500)
            .send({ message: `Error al salvar en la base de datos: ${err} ` });
        } else {
          res.status(200).send({ movement: movementStored });
        }
      });
    }
  });
}

function updateMovement(req, res) {
  let movementId = req.params.movementId;
  let update = req.body;

  Movement.findByIdAndUpdate(
    movementId,
    update,
    { new: true },
    (err, movementUpdated) => {
      if (err) {
        res
          .status(500)
          .send({ message: `Error al actualizar el movemento: ${err}` });
      } else {
        res.status(200).send({ movement: movementUpdated });
      }
    }
  );
}

function deleteMovement(req, res) {
  let movementId = req.params.movementId;

  Movement.findById(movementId, (err, movement) => {
    if (err) {
      res.status(500).send({ message: `Error al borrar el movemento: ${err}` });
    } else {
      movement.remove(err => {
        if (err) {
          res
            .status(500)
            .send({ message: `Error al borrar el movemento: ${err}` });
        } else {
          res.status(200).send({ message: 'El movemento ha sido eliminado' });
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
