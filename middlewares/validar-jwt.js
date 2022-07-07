const { response } = require('express');
const jwt  = require('jsonwebtoken');


const validarJWT=(req, res=response, next)=>{

    //leer el Token
    const token = req.header('x-token');
 
    if(!token){
        return res.status(401).json({
            ok:false,
            msg:'No hay token en la petición, x-token no existe'
        });
    }

    //Verificar Token
    try {

        const { uid, email } = jwt.verify(token,process.env.JWT_SECRET);

        req.uid = uid;
        req.email = email;

        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg:'Error, Token no válido'
        })
    }

}

module.exports ={
    validarJWT
}