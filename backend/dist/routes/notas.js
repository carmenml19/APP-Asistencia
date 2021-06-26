"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var notas_model_1 = require("../models/notas.model");
var notasRoutes = express_1.Router();
notasRoutes.post('/', function (req, res) {
    var array = req.body;
    var todoOk = true;
    var mensaje = 'Asistencia Guardada Correctamente';
    for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
        var objeto = array_1[_i];
        var nota = {
            nombre: objeto.nombre,
            notaOrdinaria: objeto.notaOrdinaria,
            notaExtraordinaria: objeto.notaExtraordinaria,
            asistenciaTotal: objeto.asistenciaTotal,
            notaFinalOrdinaria: objeto.notaFinalOrdinaria,
            notaFinalExtraordinaria: objeto.notaFinalExtraordinaria,
            bonificacion: objeto.bonificacion,
            aplica: objeto.aplica,
            clase: objeto.clase,
            fechaNota: objeto.fechaNota,
            numeroUltimaNota: objeto.numeroUltimaNota
        };
        notas_model_1.Notas.create(nota).then(function (notaDB) {
        }).catch(function (err) {
            todoOk = false;
            mensaje = 'Fallo al guardar asistencia error: ', err;
        });
    }
    res.json({
        ok: todoOk,
        usuario: mensaje
    });
});
notasRoutes.post('/listarNotas', function (req, res) {
    var todoOk = true;
    var mensaje = 'Listado notas cargado correctamente';
    var clase = req.body.nombreClase;
    console.log('CLASE: ', req.body);
    notas_model_1.Notas.find({ "clase": clase }).sort({ fechaNota: -1 }).then(function (lista) {
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
exports.default = notasRoutes;
