"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var Token = /** @class */ (function () {
    function Token() {
    }
    Token.getJwtToken = function (payload) {
        return jsonwebtoken_1.default.sign({
            usuario: payload
        });
    };
    Token.seed = 'seed-de-mi-app';
    Token.caducidad = '300d';
    return Token;
}());
exports.default = Token;
