
const {response} = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helper/jwt');

const login = async(req, res = response)=>{

    const {email, password }= req.body;

    try {
        
        const usuarioDB = await Usuario.findOne({email});
        if(!usuarioDB){
            return res.status(400).json({
                ok:false,
                msg:'Datos de Login no válido'
            })
        }

        //verificar contraseña
        const validPassword = bcryptjs.compareSync( password, usuarioDB.password)
        if(!validPassword){
            return res.status(400).json({
                ok:false,
                msg: 'Datos de Login no válidozz'
            })
        }
        //Generar el Token - JWT
        const token = await generarJWT(usuarioDB.id, email)

        res.json({
            ok:true,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Error inesperado, hablar con el administrador'
        })
    }

}

module.exports ={
    login
}