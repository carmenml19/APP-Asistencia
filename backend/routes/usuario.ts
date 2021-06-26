import { Router, Request, Response } from 'express';
import { Usuario } from '../models/usuario.model';
import bcrypt from 'bcrypt';

const jwt = require('jsonwebtoken');
const SECRET_KEY = 'secretkey123456';
const userRoutes = Router();


userRoutes.post('/createUser', (req: Request, res: Response) => {
    
    const user = {
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        facultad: req.body.facultad
    }


    Usuario.create ( user ).then( userDB => {
        res.json({
            ok: true,
            usuario: userDB
        });
    }).catch(error => {
        console.log('Error al crear usuario: ', error);
        res.json({
            ok: false,
            error: error
        });
    });
});


userRoutes.post('/login', (req: Request, res: Response) => {
    
    const usuario = {
        email: req.body.email,
        password: req.body.password
    }

    console.log('USUARIO RECIBIDO: ', usuario);
    

    Usuario.findOne({email: usuario.email}, (err: any, user: any) => {
        if(err) return res.status(500).send('Server error');
        if(!user){
            res.status(409).send({message: 'Usuario incorrecto'});
        } else {
         
            if( user.compararPassword( req.body.password, user.password)){
                const expiresIn = 5*60*60;
                const accessToken = jwt.sign({id: user.id}, SECRET_KEY, {expiresIn: expiresIn});
                
                const dataUser = {
                    email: user.email,
                    accessToken: accessToken,
                    facultad: user.facultad,
                    expiresIn: expiresIn
                }
              
                res.send({dataUser});
            } else {
                res.status(409).send({message: 'Contraseña incorrecta'});
            }
        }
    });

});

export default userRoutes;
