"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usuario = void 0;
var mongoose_1 = require("mongoose");
var bcrypt_1 = __importDefault(require("bcrypt"));
var userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: [true, 'El email es necesario'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
    },
    facultad: {
        type: String,
    }
});
userSchema.method('compararPassword', function (pass, password) {
    if (pass === void 0) { pass = ''; }
    if (password === void 0) { password = ''; }
    if (bcrypt_1.default.compareSync(pass, password)) {
        return true;
    }
    else {
        return false;
    }
});
exports.Usuario = mongoose_1.model('Usuario', userSchema);
