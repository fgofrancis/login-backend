require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/config');

//Crear el servidor de express
const app = express();

//Configurar CORS, el use(middlewere) es una funcion que se va a ejecutar desde esa linea
// hacia abajo
app.use(cors() );


// Carpeta pública
app.use( express.static('public') );


//Lectura y parseo del body
app.use(express.json() );


//Base de datos
dbConnection();

//crear la rutas
app.use('/api/usuario', require('./routes/usuario-route'));
app.use('/api/login', require('./routes/auth-route'));



app.listen(process.env.PORT,()=>{
    console.log('Servidor corriendo en el puerto ' + process.env.PORT);

})
