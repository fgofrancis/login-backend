
const {response} = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helper/jwt');
const { googleVerify } = require('../helper/google-verify');

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
const googleSignIn = async(req, res=response)=>{

    try {
        const {name, email, picture } = await googleVerify(req.body.token);
       
        const usuarioDB = await Usuario.findOne({email});
        let usuario;

        if(!usuarioDB){
            usuario = new Usuario({
                nombre:name,
                email,
                password:'@@', //Este password no se usa es solo para pasar la validacion
                img:picture,
                google:true
            })
        }else{
            usuario = usuarioDB;
            usuario.google = true; // esto es para q se pueda autenticar x google
        }

        //Guardar usuario
        await usuario.save();

        //Generar el Token - JWT
        const token = await generarJWT(usuario.id, email)

        res.json({
            ok:true,
            name, email, picture,
            token
        });
        
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            ok:false,
            msg:'Error al verificar el Google-Token'
        })
    }

}

module.exports ={
    login,
    googleSignIn
}