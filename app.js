'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('express-handlebars');
const cors = require('cors');
const app = express();
const api = require('./routes');
const morgan = require('morgan');

app.use(cors());

app.use(morgan('dev'));

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use(bodyParser.json());
app.engine(
  '.hbs',
  hbs({
    defaultLayout: 'default',
    extname: '.hbs'
  })
);
app.set('view engine', '.hbs');

app.use('/api', api);
app.get('/login', (req, res) => {
  res.render('login');
});
app.get('/', (req, res) => {
  res.render('login');
});

module.exports = app;
