"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const api = require("./routes");
const morgan = require("morgan");

app.use(cors());

app.use(morgan("dev"));

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use(bodyParser.json());

app.use("/api", api);

module.exports = app;
