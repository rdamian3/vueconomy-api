'use strict';

import express from 'express';
import { urlencoded, json } from 'body-parser';
import hbs from 'express-handlebars';
import cors from 'cors';
const app = express();
import api from './routes';
import morgan from 'morgan';

app.set('port', process.env.PORT || 3001);

app.use(cors());

app.use(morgan('dev'));

app.use(
  urlencoded({
    extended: false,
  })
);

app.use(json());

app.engine(
  '.hbs',
  hbs({
    defaultLayout: 'default',
    extname: '.hbs',
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

export default app;
