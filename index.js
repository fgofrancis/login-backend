require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/config');

//Crear el servidor de express
const app = express();

//Configurar CORS, el use(middlewere) es una funcion que se va a ejecutar desde esa linea
// hacia abajo
app.use(cors() );

//Base de datos
dbConnection();

//crear la rutas
app.get('/', (req, res)=>{
    
    res.json({
        ok:true,
        msg:'Hola mundo'
    })
})
app.listen(process.env.PORT,()=>{
    console.log('Servidor corriendo en el puerto ' + process.env.PORT);

})
