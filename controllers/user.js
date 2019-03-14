'use strict';

const User = require('../models/user');
const service = require('../services');
const nodemailer = require('nodemailer');

function signUp(req, res) {
  const user = new User();
  user.email = req.body.email;
  user.displayName = req.body.displayName;
  user.password = req.body.password;

  if (user.email != '' || user.email != null) {
    user.save(err => {
      if (err) {
        if (err.code == 11000) {
          return res
            .status(500)
            .send('Error al crear el usuario: Usuario duplicado');
        }
        return res.status(500).send({
          message: `Error al crear el usuario: ${err}`
        });
      } else {
        return res.status(201).send({
          token: service.createToken(user)
        });
      }
    });
  } else {
    res.status(500).send({
      message: 'Error al crear el usuario'
    });
  }
}

function signIn(req, res) {
  const email = req.body.email;
  const pswd = req.body.password;
  if (email == '' || pswd == '') {
    res.status(401).send({
      message: 'Falta usuario o contraseña...'
    });
  } else {
    User.find(
      {
        email: req.body.email
      },
      (err, user) => {
        if (err)
          return res.status(500).send({
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
            token: service.createToken(user)
          });
        }
      }
    );
  }
}

function reqResetPassword(){
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'rdamian3dev@gmail.com',
      pass: '!Dd302010d'
    }
  });

  var mailOptions = {
    from: 'rdamian3@gmail.com',
    to: 'damian.acevedo@conexiogroup.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

module.exports = {
  signUp,
  signIn,
  reqResetPassword
};
