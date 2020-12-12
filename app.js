'use strict';

import express from 'express';
import { urlencoded, json } from 'body-parser';
import cors from 'cors';
const app = express();
import api from './src/routes';
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

app.set('view engine', '.hbs');

app.use(json());

app.use('/api', api);

export default app;
