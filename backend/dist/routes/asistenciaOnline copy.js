"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var asistenciaOnline_model_1 = require("../models/asistenciaOnline.model");
var asistenciaOnlineRoutes = express_1.Router();
asistenciaOnlineRoutes.post('/', function (req, res) {
    var array = req.body;
    var todoOk = true;
    var mensaje = 'Asistencia Guardada Correctamente';
    for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
        var objeto = array_1[_i];
        var asistenciaOnline = {
            name: objeto.name,
            username: objeto.username,
            role: objeto.role,
            tipoAsistencia: objeto.tipoAsistencia,
            fechaEntrada: objeto.fechaEntrada,
            fechaSalida: objeto.fechaSalida,
            tiempoTotal: objeto.tiempoTotal,
            numeroAccesoClase: objeto.numeroAccesoClase,
            clase: objeto.clase,
            valida: objeto.valida
        };
        asistenciaOnline_model_1.AsistenciaOnline.create(asistenciaOnline).then(function (asistenciaOnlineDB) {
        }).catch(function (err) {
            todoOk = false;
            mensaje = 'Fallo al guardar asistencia error: ' + err;
        });
    }
    res.json({
        ok: todoOk,
        usuario: mensaje
    });
});
exports.default = asistenciaOnlineRoutes;
