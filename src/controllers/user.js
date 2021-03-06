'use strict';

const User = require('../models/user');
const service = require('../services');
const nodemailer = require('nodemailer');
const config = require('../config');
const s3 = require('../services/s3');

function signUp(req, res) {
  if (req.body.email !== '' || req.body.email !== null) {
    if (req.body.email.length < 50) {
      const userFolder = s3.createUserFolder(req.body.email);
      const user = new User({
        email: req.body.email,
        displayName: req.body.displayName,
        password: req.body.password,
        bucket: userFolder,
      });
      user.save((err) => {
        if (err) {
          if (err.code === 11000) {
            return res.status(500).send('Error creating user: duplicated user');
          }
          return res.status(500).send({
            message: `Error creating user: ${err}`,
          });
        }
        return res.status(201).send({
          token: service.createToken(user),
          user,
        });
      });
    } else {
      res.status(500).send({
        message: 'Too many characters for email: 50+',
      });
    }
  } else {
    res.status(500).send({
      message: 'Error creating user',
    });
  }
}

function signIn(req, res) {
  const email = req.body.email;
  const pswd = req.body.password;
  if (email === '' || pswd === '') {
    res.status(401).send({ message: 'User or password missing' });
  } else {
    User.findOne(
      {
        email: req.body.email,
      },
      (err, user) => {
        if (err)
          return res.status(500).send({
            message: err,
          });
        if (!user || user.length === 0) {
          return res.status(404).send({
            message: 'User doesnt exists',
          });
        }
        user.comparePassword(pswd, user.password, (err, areEqual) => {
          if (areEqual) {
            res.status(200).send({
              message: 'Logged in successfuly',
              token: service.createToken(user),
              user,
            });
          } else {
            return res.status(403).send({
              message: 'Invalid user or password',
            });
          }
        });
      }
    );
  }
}

function deleteUser(req, res) {
  if (req.user.userId !== '') {
    User.findById(req.user.userId, (err, user) => {
      if (err) {
        res.status(500).send({ message: `Error while deleting user: ${err}` });
      } else if (user !== null) {
        s3.deleteBucket(user.bucket);
        user.remove((err) => {
          if (err) {
            res
              .status(500)
              .send({ message: `Error while deleting user: ${err}` });
          } else {
            res.status(200).send({ message: 'User eliminated' });
          }
        });
      } else {
        res.status(500).send({ message: 'User not found' });
      }
    });
  }
}

function updateUser(req, res) {
  const userId = req.user.userId;
  const update = req.body;

  if (userId !== null) {
    User.findByIdAndUpdate(
      userId,
      update,
      { new: true },
      (err, userUpdated) => {
        if (err) {
          res.status(500).send({ message: `Error updating user: ${err}` });
        } else {
          res.status(200).send({ user: userUpdated });
        }
      }
    );
  }
}

function uploadData(req, res) {
  s3.uploadToBucket(req, res)
    .then((result) => {
      const userId = result.userId;
      const avatar = result.file;
      const newObj = { ...req.body, avatar, userId };
      req.body = newObj;
      updateUser(req, res);
    })
    .catch(() => {
      res.status(500).send({ message: 'No se pudo agregar' });
    });
}

function reqResetPassword(req, res) {
  if (req.body.email !== '' && req.body.email !== null) {
    User.findOne(
      {
        email: req.body.email,
      },
      (err, user) => {
        if (err)
          return res.status(500).send({
            message: err,
          });
        if (!user || user.length === 0) {
          return res.status(404).send({
            message: 'User doesnt exists',
          });
        }
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: config.emailUser,
            pass: config.emailPassword,
          },
        });

        const mailOptions = {
          from: 'rdamian3dev@gmail.com',
          to: user.email,
          subject: 'Reset your password',
          html: `<strong>Password Reset</strong><br>
            <p>Hi ${user.displayName} </p><br>
              <p>Please use this link to reset your password</p><br>
              <a href="google.com">Click here!</a>`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
            res.status(200).send({ message: 'Email sent' });
          }
        });
      }
    );
  } else {
    res.status(400).send({ message: 'No email provided' });
  }
}

function replacePassword(req, res) {
  const userEmail = req.body.email;

  if (req.body.email !== '') {
    User.findOneAndUpdate(
      { email: userEmail },
      { $set: req.body },
      { new: true },
      (err, userUpdated) => {
        if (err) {
          res.status(500).send({ message: `Error updating movement: ${err}` });
        } else {
          res.status(200).send({ user: userUpdated });
        }
      }
    );
  }
}

function checkAuth(req, res) {
  if (req.user.status === 200) {
    res.status(200).send({ message: 'auth is valid' });
  } else {
    res.status(500).send({ message: 'You have no authorization' });
  }
}

module.exports = {
  signUp,
  signIn,
  deleteUser,
  uploadData,
  reqResetPassword,
  replacePassword,
  updateUser,
  checkAuth,
};
