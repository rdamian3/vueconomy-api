'use strict';

const jwt = require('jwt-simple');
const moment = require('moment');
const config = require('../config');

function createToken(user) {
  const payload = {
    sub: user._id,
    iat: moment().unix(),
    exp: moment()
      .add(14, 'seconds')
      .unix()
  };

  return jwt.encode(payload, config.SECRET_TOKEN);
}

function decodeToken(token) {
  const decoded = new Promise((resolve, reject) => {
    try {
      jwt.decode(token, config.SECRET_TOKEN);
      resolve(payload.sub);
    } catch (err) {
      if (err.message == 'Token expired') {
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
  createToken,
  decodeToken
};
