const { response } = require('express')
const Usuario = require('../models/usuario');
const passcrypt = require('bcryptjs');
const { generarJWT } = require('../helper/jwt');

 const getUsuarios = async(req, res)=>{
    
    const usuarios = await Usuario.find();

    res.json({
        ok:true,
        usuarios,
        uid:req.uid  //tomando el uid del token q se encuentra en el jwt, ver middleware validar-jwt
    })
}

const crearUsuario = async(req, res= response)=>{

    const { email, password } = req.body;

    try {

        const emailExiste = await Usuario.findOne({email});

        if(emailExiste){
            return res.status(400).json({
                ok:false,
                msg:`${email}, Este correo ya está registrado`
            })
        };

        const usuario = new Usuario(req.body);

        //Encriptar contraseña, contraseña de una sola via, solo se matchea no se reescribe
        const salt = passcrypt.genSaltSync();
        usuario.password = passcrypt.hashSync(password, salt);

        await usuario.save();

        //Generar el Token - JWT
        const token = await generarJWT(usuario.id, usuario.email)

        res.json({
            ok:true,
            usuario,
            token
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Error inesperado, creando usuario!!!'
        })
    };
  
}

const actualizarUsuario = async(req, res= response)=>{

    const uid = req.params.id
    
    try {
        
        const usuarioDB = await Usuario.findById(uid);

        if(!usuarioDB){
            return res.status(400).json({
                ok:false,
                msg:'Usuario no existe con ese uid'
            })
        }

        //TODO validar token y ver si es el usuario correcto
        //Actualizar
        const {password, google,email, ...campos} = req.body;

        if( usuarioDB.email !== email ){
            
            const existeEmail = await Usuario.findOne({ email });
            if(existeEmail){
                return res.status(400).json({
                    ok:true,
                    msg:'Ya existe un usuario con ese Email'
                })
            }
        }
        campos.email = email;
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos,{new:true});

        res.json({
            ok:true,
            usuario:usuarioActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Error inesperado al actualizar usuario'
        })
    }
};

const borrarUsuario = async(req, res)=>{
/**
 * Nota: en el backend definitivo no borraremos usuarios usaremos un estado y será activo o inactivo
 * puedo usar delete en el route y aqui no borrar sino actualizar
 */
    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if(!usuarioDB){
            return res.status(404).json({
                ok:false,
                msg:'Usuario no existe con ese Uid'
            })
        }

        await Usuario.findByIdAndDelete(uid);

        res.status(200).json({
            ok:true,
            msg:'Usuario Eliminado'
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Error inesperado borrando usuario'
        })
    }
}

module.exports ={
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}
