'use strict';

const User = require('../models/user');
const service = require('../services');
const Utils = require('./utils');

function signUp(req, res) {
  const user = new User({
    email: req.body.email,
    displayName: req.body.displayName,
    password: req.body.password,
  });

  if (Utils.checkUserNotNull(user)) {
    user.save(err => {
      if (err) return res.status(500).send({
        message: `Error al crear el usuario: ${err}`
      });

      return res.status(201).send({
        token: service.createToken(user)
      });
    });
  } else {
    res.status(500).send({
      message: "Error al crear el usuario"
    });
  }
}

function signIn(req, res) {
  const email = req.body.email;
  const pswd = req.body.password;
  if (email == "" || pswd == "") {
    res.status(401).send({
      message: "Falta usuario o contraseña..."
    })
  } else {
    User.find({
      email: req.body.email
    }, (err, user) => {
      if (err) return res.status(500).send({
        message: err
      });
      if (!user || user.length == 0) {
        return res.status(404).send({
          message: 'No existe el usuario'
        });
      } else {
        req.user = user;
        res.status(200).send({
          message: 'Te has logueado correctamente',
          token: service.createToken(user),
        });
      }
    });
  }
}

module.exports = {
  signUp,
  signIn,
};