'use strict';

var jwt = require('jwt-simple');

var moment = require('moment');

var config = require('../../config');

function createToken(user) {
  var payload = {
    sub: user._id,
    iat: moment().unix(),
    exp: moment().add(1, 'hour').unix()
  };
  return jwt.encode(payload, config.SECRET_TOKEN);
}

function decodeToken(token) {
  var decoded = new Promise(function (resolve, reject) {
    try {
      var payload = jwt.decode(token, config.SECRET_TOKEN);

      if (payload && payload.exp <= moment().unix()) {
        reject({
          status: 401,
          message: 'Token expired'
        });
      }

      resolve({
        status: 200,
        message: 'Access granted',
        userId: payload.sub
      });
    } catch (err) {
      if (err.message === 'Token expired') {
        reject({
          status: 401,
          message: 'Token expired'
        });
      } else {
        reject({
          status: 403,
          message: 'Unauthorized'
        });
      }
    }
  });
  return decoded;
}

module.exports = {
  createToken: createToken,
  decodeToken: decodeToken
};