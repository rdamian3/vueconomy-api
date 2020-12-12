"use strict";

var services = require("../services");

function isAuth(req, res, next) {
  var token = req.headers.authorization;

  if (!token) {
    return res.status(403).send({
      message: "No tienes autorización"
    });
  }

  services.decodeToken(token).then(function (response) {
    req.user = response;
    next();
  })["catch"](function (response) {
    return res.status(response.status).send({
      message: response.message
    });
  });
}

module.exports = isAuth;