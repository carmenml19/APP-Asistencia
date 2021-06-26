"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var usuario_model_1 = require("../models/usuario.model");
var bcrypt_1 = __importDefault(require("bcrypt"));
var jwt = require('jsonwebtoken');
var SECRET_KEY = 'secretkey123456';
var userRoutes = express_1.Router();
userRoutes.post('/createUser', function (req, res) {
    var user = {
        email: req.body.email,
        password: bcrypt_1.default.hashSync(req.body.password, 10),
        facultad: req.body.facultad
    };
    usuario_model_1.Usuario.create(user).then(function (userDB) {
        res.json({
            ok: true,
            usuario: userDB
        });
    }).catch(function (error) {
        console.log('Error al crear usuario: ', error);
        res.json({
            ok: false,
            error: error
        });
    });
});
userRoutes.post('/login', function (req, res) {
    var usuario = {
        email: req.body.email,
        password: req.body.password
    };
    console.log('USUARIO RECIBIDO: ', usuario);
    usuario_model_1.Usuario.findOne({ email: usuario.email }, function (err, user) {
        if (err)
            return res.status(500).send('Server error');
        if (!user) {
            res.status(409).send({ message: 'Usuario incorrecto' });
        }
        else {
            if (user.compararPassword(req.body.password, user.password)) {
                var expiresIn = 5 * 60 * 60;
                var accessToken = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: expiresIn });
                var dataUser = {
                    email: user.email,
                    accessToken: accessToken,
                    facultad: user.facultad,
                    expiresIn: expiresIn
                };
                res.send({ dataUser: dataUser });
            }
            else {
                res.status(409).send({ message: 'Contraseña incorrecta' });
            }
        }
    });
});
exports.default = userRoutes;
