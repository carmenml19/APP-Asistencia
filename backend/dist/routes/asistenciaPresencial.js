"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var asistenciaOnline_model_1 = require("../models/asistenciaOnline.model");
var asistenciaPresencialRoutes = express_1.Router();
asistenciaPresencialRoutes.post('/listarNombresAlumnos', function (req, res) {
    var todoOk = true;
    var mensaje = 'Listado alumnos cargado correctamente';
    var clase = req.body.clase;
    console.log('CLASE: ', clase);
    asistenciaOnline_model_1.AsistenciaOnline.find({ "clase": clase }).distinct("name").then(function (lista) {
        console.log('lista: ', lista);
        res.json({
            ok: todoOk,
            mensaje: mensaje,
            lista: lista
        });
    }).catch(function (err) {
        todoOk = false;
        mensaje = 'Fallo al guardar asistencia error: ' + err;
        res.json({
            ok: todoOk,
            mensaje: mensaje
        });
    });
});
asistenciaPresencialRoutes.post('/listarAsitenciasTotales', function (req, res) {
    var todoOk = true;
    var mensaje = 'Listado alumnos cargado correctamente';
    var clase = req.body.clase;
    console.log('CLASE: ', clase);
    asistenciaOnline_model_1.AsistenciaOnline.find({ "clase": clase }).then(function (lista) {
        console.log('lista: ', lista);
        res.json({
            ok: todoOk,
            mensaje: mensaje,
            lista: lista
        });
    }).catch(function (err) {
        todoOk = false;
        mensaje = 'Fallo al guardar asistencia error: ' + err;
        res.json({
            ok: todoOk,
            mensaje: mensaje
        });
    });
});
asistenciaPresencialRoutes.post('/marcarAsistencia', function (req, res) {
    var todoOk = true;
    var mensaje = 'Asistencia marcada correctamente';
    var asistenciaPresencial = {
        name: req.body.name,
        role: req.body.role,
        fechaEntrada: req.body.fechaEntrada,
        asiste: req.body.asiste,
        clase: req.body.clase
    };
    asistenciaOnline_model_1.AsistenciaOnline.create(asistenciaPresencial).then(function (asistenciaPresencialBD) {
    }).catch(function (err) {
        todoOk = false;
        mensaje = 'Fallo al guardar asistencia error: ' + err;
    });
    res.json({
        ok: todoOk,
        mensaje: mensaje
    });
});
exports.default = asistenciaPresencialRoutes;
