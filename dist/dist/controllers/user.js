'use strict';

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

var User = require('../models/user');

var service = require('../services');

var nodemailer = require('nodemailer');

var config = require('../../config');

var s3 = require('../services/s3');

function signUp(req, res) {
  if (req.body.email !== '' || req.body.email !== null) {
    if (req.body.email.length < 50) {
      var userFolder = s3.createUserFolder(req.body.email);
      var user = new User({
        email: req.body.email,
        displayName: req.body.displayName,
        password: req.body.password,
        bucket: userFolder
      });
      user.save(function (err) {
        if (err) {
          if (err.code === 11000) {
            return res.status(500).send('Error creating user: duplicated user');
          }

          return res.status(500).send({
            message: "Error creating user: ".concat(err)
          });
        }

        return res.status(201).send({
          token: service.createToken(user),
          user: user
        });
      });
    } else {
      res.status(500).send({
        message: 'Too many characters for email: 50+'
      });
    }
  } else {
    res.status(500).send({
      message: 'Error creating user'
    });
  }
}

function signIn(req, res) {
  var email = req.body.email;
  var pswd = req.body.password;

  if (email === '' || pswd === '') {
    res.status(401).send({
      message: 'User or password missing'
    });
  } else {
    User.findOne({
      email: req.body.email
    }, function (err, user) {
      if (err) return res.status(500).send({
        message: err
      });

      if (!user || user.length === 0) {
        return res.status(404).send({
          message: 'User doesnt exists'
        });
      }

      user.comparePassword(pswd, user.password, function (err, areEqual) {
        if (areEqual) {
          res.status(200).send({
            message: 'Logged in successfuly',
            token: service.createToken(user),
            user: user
          });
        } else {
          return res.status(403).send({
            message: 'Invalid user or password'
          });
        }
      });
    });
  }
}

function deleteUser(req, res) {
  if (req.user.userId !== '') {
    User.findById(req.user.userId, function (err, user) {
      if (err) {
        res.status(500).send({
          message: "Error while deleting user: ".concat(err)
        });
      } else if (user !== null) {
        s3.deleteBucket(user.bucket);
        user.remove(function (err) {
          if (err) {
            res.status(500).send({
              message: "Error while deleting user: ".concat(err)
            });
          } else {
            res.status(200).send({
              message: 'User eliminated'
            });
          }
        });
      } else {
        res.status(500).send({
          message: 'User not found'
        });
      }
    });
  }
}

function updateUser(req, res) {
  var userId = req.user.userId;
  var update = req.body;

  if (userId !== null) {
    User.findByIdAndUpdate(userId, update, {
      "new": true
    }, function (err, userUpdated) {
      if (err) {
        res.status(500).send({
          message: "Error updating user: ".concat(err)
        });
      } else {
        res.status(200).send({
          user: userUpdated
        });
      }
    });
  }
}

function uploadData(req, res) {
  s3.uploadToBucket(req, res).then(function (result) {
    var userId = result.userId;
    var avatar = result.file;

    var newObj = _objectSpread(_objectSpread({}, req.body), {}, {
      avatar: avatar,
      userId: userId
    });

    req.body = newObj;
    updateUser(req, res);
  })["catch"](function () {
    res.status(500).send({
      message: 'No se pudo agregar'
    });
  });
}

function reqResetPassword(req, res) {
  if (req.body.email !== '' && req.body.email !== null) {
    User.findOne({
      email: req.body.email
    }, function (err, user) {
      if (err) return res.status(500).send({
        message: err
      });

      if (!user || user.length === 0) {
        return res.status(404).send({
          message: 'User doesnt exists'
        });
      }

      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: config.emailUser,
          pass: config.emailPassword
        }
      });
      var mailOptions = {
        from: 'rdamian3dev@gmail.com',
        to: user.email,
        subject: 'Reset your password',
        html: "<strong>Password Reset</strong><br>\n            <p>Hi ".concat(user.displayName, " </p><br>\n              <p>Please use this link to reset your password</p><br>\n              <a href=\"google.com\">Click here!</a>")
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
          res.status(200).send({
            message: 'Email sent'
          });
        }
      });
    });
  } else {
    res.status(400).send({
      message: 'No email provided'
    });
  }
}

function replacePassword(req, res) {
  var userEmail = req.body.email;

  if (req.body.email !== '') {
    User.findOneAndUpdate({
      email: userEmail
    }, {
      $set: req.body
    }, {
      "new": true
    }, function (err, userUpdated) {
      if (err) {
        res.status(500).send({
          message: "Error updating movement: ".concat(err)
        });
      } else {
        res.status(200).send({
          user: userUpdated
        });
      }
    });
  }
}

function checkAuth(req, res) {
  if (req.user.status === 200) {
    res.status(200).send({
      message: 'auth is valid'
    });
  } else {
    res.status(500).send({
      message: 'You have no authorization'
    });
  }
}

module.exports = {
  signUp: signUp,
  signIn: signIn,
  deleteUser: deleteUser,
  uploadData: uploadData,
  reqResetPassword: reqResetPassword,
  replacePassword: replacePassword,
  updateUser: updateUser,
  checkAuth: checkAuth
};