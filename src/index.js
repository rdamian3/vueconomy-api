import { set, connect } from 'mongoose';
import app from './app';
import { db } from './config';

set('useFindAndModify', false);

connect(
  db,
  { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) {
      return console.log(`Error al conectar a la base de datos: ${err}`);
    }
    console.log('Conexión a la base de datos establecida...');
    app.listen(app.get('port'), () => {
      console.log(`API REST corriendo en http://localhost:${app.get('port')}`);
    });
  }
);
