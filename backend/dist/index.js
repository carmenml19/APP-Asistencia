"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = __importDefault(require("./classes/server"));
var usuario_1 = __importDefault(require("./routes/usuario"));
var mongoose_1 = __importDefault(require("mongoose"));
var body_parser_1 = __importDefault(require("body-parser"));
var cors_1 = __importDefault(require("cors"));
var asistenciaOnline_1 = __importDefault(require("./routes/asistenciaOnline"));
var asistenciaPresencial_1 = __importDefault(require("./routes/asistenciaPresencial"));
var clases_1 = __importDefault(require("./routes/clases"));
var notas_1 = __importDefault(require("./routes/notas"));
var server = new server_1.default();
// Body parser
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
//CORS
server.app.use(cors_1.default({ origin: true, credentials: true }));
//Rutas de la AppAsistencia
server.app.use('/user', usuario_1.default);
server.app.use('/asistenciaOnline', asistenciaOnline_1.default);
server.app.use('/asistenciaPresencial', asistenciaPresencial_1.default);
server.app.use('/clases', clases_1.default);
server.app.use('/notas', notas_1.default);
// Conectar DB
mongoose_1.default.connect('mongodb://localhost:27017/AppAsistencia', { useNewUrlParser: true, useCreateIndex: true }, function (error) {
    if (error) {
        console.log('ERROR BD: ', error);
    }
    console.log('Base de datos ONLINE');
});
//Levantar express
server.start(function () {
    console.log("Servidor corriendo en el puerto: " + server.port);
});
