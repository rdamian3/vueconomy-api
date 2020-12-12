"use strict";

const services = require("../services");

function isAuth(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(403).send({ message: "No tienes autorización" });
  }

  services
    .decodeToken(token)
    .then(response => {
      req.user = response;
      next();
    })
    .catch(response =>
      res.status(response.status).send({ message: response.message })
    );
}

module.exports = isAuth;
