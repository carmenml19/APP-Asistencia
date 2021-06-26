"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var clases_1 = require("../models/clases");
var jwt = require('jsonwebtoken');
var SECRET_KEY = 'secretkey123456';
var clasesRouts = express_1.Router();
clasesRouts.post('/addAsignatura', function (req, res) {
    var clase = {
        nombreClase: req.body.nombreClase,
        facultad: req.body.facultad,
        esAsistenciaOnline: req.body.esAsistenciaOnline
    };
    var todoOk = true;
    var mensaje = 'Numero de clases pasadas obtenido correctamente.';
    var numeroClases;
    clases_1.Clases.findOne({ nombreClase: clase.nombreClase }).then(function (resp) {
        if (resp != null) {
            var numClasesOnline_1 = parseInt(resp.numeroAsistenciasPasadasOnline, 10) + 1;
            var numClasesPresenciales_1 = parseInt(resp.numeroAsistenciasPasadasPresenciales, 10) + 1;
            if (clase.esAsistenciaOnline) {
                clases_1.Clases.updateOne({ nombreClase: resp === null || resp === void 0 ? void 0 : resp.nombreClase }, { numeroAsistenciasPasadasOnline: numClasesOnline_1.toString() }).then(function (resp) {
                    numeroClases = numClasesOnline_1.toString();
                    res.json({
                        ok: todoOk,
                        mensaje: mensaje,
                        numeroClases: numeroClases
                    });
                }).catch(function (error) {
                    todoOk = false;
                    mensaje = 'Fallo al obtener clases error: ' + error;
                    res.json({
                        ok: todoOk,
                        mensaje: mensaje,
                        numeroClases: numeroClases
                    });
                });
            }
            else {
                clases_1.Clases.updateOne({ nombreClase: resp === null || resp === void 0 ? void 0 : resp.nombreClase }, { numeroAsistenciasPasadasPresenciales: numClasesPresenciales_1.toString() }).then(function (resp) {
                    numeroClases = numClasesPresenciales_1.toString();
                    res.json({
                        ok: todoOk,
                        mensaje: mensaje,
                        numeroClases: numeroClases
                    });
                }).catch(function (error) {
                    todoOk = false;
                    mensaje = 'Fallo al obtener clases error: ' + error;
                    res.json({
                        ok: todoOk,
                        mensaje: mensaje,
                        numeroClases: numeroClases
                    });
                });
            }
        }
        else {
            var claseC = void 0;
            if (clase.esAsistenciaOnline) {
                claseC = {
                    nombreClase: clase.nombreClase,
                    numeroAsistenciasPasadasOnline: "1",
                    numeroAsistenciasPasadasPresenciales: "0",
                    facultad: clase.facultad
                };
            }
            else {
                claseC = {
                    nombreClase: clase.nombreClase,
                    numeroAsistenciasPasadasOnline: "0",
                    numeroAsistenciasPasadasPresenciales: "1",
                    facultad: clase.facultad
                };
            }
            clases_1.Clases.create(claseC).then(function (asistenciaPresencialBD) {
                res.json({
                    ok: todoOk,
                    mensaje: mensaje,
                    numeroClases: "1"
                });
            }).catch(function (err) {
                todoOk = false;
                mensaje = 'Fallo al obtener clases error: ' + err;
                res.json({
                    ok: todoOk,
                    mensaje: mensaje,
                    numeroClases: "0"
                });
            });
        }
    });
});
clasesRouts.post('/getNumAsistencias', function (req, res) {
    var clase = {
        nombreClase: req.body.nombreClase,
        facultad: req.body.facultad
    };
    var todoOk = true;
    var mensaje = 'Numero de clases pasadas obtenido correctamente.';
    var numeroClases;
    clases_1.Clases.findOne({ nombreClase: clase.nombreClase }).then(function (resp) {
        if (resp != null) {
            res.json({
                ok: todoOk,
                mensaje: mensaje,
                numeroClasesOnline: resp.numeroAsistenciasPasadasOnline,
                numeroClasesPresenciales: resp.numeroAsistenciasPasadasPresenciales
            });
        }
        else {
            var claseC_1 = {
                nombreClase: clase.nombreClase,
                numeroAsistenciasPasadas: "0",
                facultad: clase.facultad
            };
            clases_1.Clases.create(claseC_1).then(function (asistenciaPresencialBD) {
                res.json({
                    ok: todoOk,
                    mensaje: mensaje,
                    numeroClasesOnline: claseC_1.numeroAsistenciasPasadas,
                    numeroClasesPresenciales: claseC_1.numeroAsistenciasPasadas
                });
            }).catch(function (err) {
                todoOk = false;
                mensaje = 'Fallo al obtener clases error: ' + err;
                res.json({
                    ok: todoOk,
                    mensaje: mensaje,
                    numeroClases: numeroClases
                });
            });
        }
    });
});
exports.default = clasesRouts;
