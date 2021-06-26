"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var clasesSchema = new mongoose_1.Schema({
    nombreClase: {
        type: String,
        unique: true
    },
    numeroAsistenciasPasadasOnline: {
        type: String
    },
    numeroAsistenciasPasadasPresenciales: {
        type: String
    },
    facultad: {
        type: String,
    }
});
exports.Clases = mongoose_1.model('Clases', clasesSchema);
