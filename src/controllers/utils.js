"use strict";

function checkUserNotNull(user) {
  if (user) {
    if (user.email !== "" || user.email !== null) {
      return true;
    }
  }
  return false;
}

module.exports = {
  checkUserNotNull
};
