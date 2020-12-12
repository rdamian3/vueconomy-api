"use strict";

var _mongoose = require("mongoose");

var _app = _interopRequireDefault(require("./app"));

var _config = require("./config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

(0, _mongoose.set)('useFindAndModify', false);
(0, _mongoose.connect)(_config.db, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
}, function (err) {
  if (err) {
    return console.log("Error al conectar a la base de datos: ".concat(err));
  }

  console.log('Conexión a la base de datos establecida...');

  _app["default"].listen(_app["default"].get('port'), function () {
    console.log("API REST corriendo en http://localhost:".concat(_app["default"].get('port')));
  });
});