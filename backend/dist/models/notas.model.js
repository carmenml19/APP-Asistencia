"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notas = void 0;
var mongoose_1 = require("mongoose");
var notasSchema = new mongoose_1.Schema({
    nombre: {
        type: String,
    },
    clase: {
        type: String,
        required: [true, 'La clase es necesaria'],
    },
    notaOrdinaria: {
        type: String,
    },
    notaExtraordinaria: {
        type: String,
    },
    asistenciaTotal: {
        type: Number,
    },
    notaFinalOrdinaria: {
        type: Number,
    },
    notaFinalExtraordinaria: {
        type: Number,
    },
    bonificacion: {
        type: Number,
    },
    aplica: {
        type: Boolean,
    },
    fechaNota: {
        type: Date,
        required: [true, 'La fecha es necesaria'],
    },
    numeroUltimaNota: {
        type: Number,
        required: [true, 'La fecha es necesaria'],
    }
});
exports.Notas = mongoose_1.model('Notas', notasSchema);
