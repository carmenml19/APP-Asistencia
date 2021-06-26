"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var asistenciaOnlineSchema = new mongoose_1.Schema({
    name: {
        type: String,
    },
    username: {
        type: String,
        default: null
    },
    role: {
        type: String
    },
    tipoAsistencia: {
        type: String,
        default: null
    },
    fechaEntrada: {
        type: String,
        default: null
    },
    fechaSalida: {
        type: String
    },
    tiempoTotal: {
        type: String,
        default: null
    },
    numeroAccesoClase: {
        type: String,
        default: null
    },
    clase: {
        type: String
    },
    asiste: {
        type: Boolean,
        default: null
    },
    valida: {
        type: Boolean,
        default: null
    }
});
exports.AsistenciaOnline = mongoose_1.model('AsistenciaOnline', asistenciaOnlineSchema);
