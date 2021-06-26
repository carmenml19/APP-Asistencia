import { Router, Request, Response } from 'express';
import { Clases } from '../models/clases';
import { Usuario } from '../models/usuario.model';


const jwt = require('jsonwebtoken');
const SECRET_KEY = 'secretkey123456';
const clasesRouts = Router();


clasesRouts.post('/addAsignatura', (req: Request, res: Response) => {
    
    const clase = {
        nombreClase: req.body.nombreClase,
        facultad: req.body.facultad,
        esAsistenciaOnline: req.body.esAsistenciaOnline
    }

    let todoOk = true;
    let mensaje = 'Numero de clases pasadas obtenido correctamente.'
    let numeroClases: string;
    Clases.findOne({nombreClase: clase.nombreClase}).then( resp => {
        if (resp != null) {
            const numClasesOnline = parseInt(resp.numeroAsistenciasPasadasOnline, 10) + 1;
            const numClasesPresenciales = parseInt(resp.numeroAsistenciasPasadasPresenciales, 10) + 1;

            if( clase.esAsistenciaOnline ) {
                Clases.updateOne({nombreClase: resp?.nombreClase}, {numeroAsistenciasPasadasOnline: numClasesOnline.toString()}).then(resp => {
                    numeroClases = numClasesOnline.toString();
                    res.json({
                        ok: todoOk,
                        mensaje: mensaje,
                        numeroClases: numeroClases
                    });
                }).catch(error => {
                    todoOk = false;
                    mensaje = 'Fallo al obtener clases error: '+error;
                    res.json({
                        ok: todoOk,
                        mensaje: mensaje,
                        numeroClases: numeroClases
                    });
            
                })
            } else {
                Clases.updateOne({nombreClase: resp?.nombreClase}, {numeroAsistenciasPasadasPresenciales: numClasesPresenciales.toString()}).then(resp => {
                    numeroClases = numClasesPresenciales.toString();
                    res.json({
                        ok: todoOk,
                        mensaje: mensaje,
                        numeroClases: numeroClases
                    });
                }).catch(error => {
                    todoOk = false;
                    mensaje = 'Fallo al obtener clases error: '+error;
                    res.json({
                        ok: todoOk,
                        mensaje: mensaje,
                        numeroClases: numeroClases
                    });
            
                })
            }
            
        } else {
            let claseC;
            if( clase.esAsistenciaOnline ) {
                claseC = {
                    nombreClase : clase.nombreClase,
                    numeroAsistenciasPasadasOnline: "1",
                    numeroAsistenciasPasadasPresenciales: "0",
                    facultad: clase.facultad
                }
            } else {
                claseC = {
                    nombreClase : clase.nombreClase,
                    numeroAsistenciasPasadasOnline: "0",
                    numeroAsistenciasPasadasPresenciales: "1",
                    facultad: clase.facultad
                }
            } 
            
            Clases.create(claseC).then( asistenciaPresencialBD => {
                res.json({
                    ok: todoOk,
                    mensaje: mensaje,
                    numeroClases: "1"
                });
            }).catch(err =>{
                todoOk = false;
                mensaje = 'Fallo al obtener clases error: '+err;
                res.json({
                    ok: todoOk,
                    mensaje: mensaje,
                    numeroClases: "0"
                });
        
            })
        }
    })

    
});


clasesRouts.post('/getNumAsistencias', (req: Request, res: Response) => {
    
    const clase = {
        nombreClase: req.body.nombreClase,
        facultad: req.body.facultad
    }
    
    let todoOk = true;
    let mensaje = 'Numero de clases pasadas obtenido correctamente.'
    let numeroClases: string;

    Clases.findOne({nombreClase: clase.nombreClase}).then( resp => {
        if (resp != null) {
            res.json({
                    ok: todoOk,
                    mensaje: mensaje,
                    numeroClasesOnline: resp.numeroAsistenciasPasadasOnline,
                    numeroClasesPresenciales: resp.numeroAsistenciasPasadasPresenciales
                });
        } else {
            const claseC = {
                nombreClase : clase.nombreClase,
                numeroAsistenciasPasadas: "0",
                facultad: clase.facultad
            }
            Clases.create(claseC).then( asistenciaPresencialBD => {
                res.json({
                    ok: todoOk,
                    mensaje: mensaje,
                    numeroClasesOnline: claseC.numeroAsistenciasPasadas,
                    numeroClasesPresenciales: claseC.numeroAsistenciasPasadas
                });
            }).catch(err =>{
                todoOk = false;
                mensaje = 'Fallo al obtener clases error: '+err;
                res.json({
                    ok: todoOk,
                    mensaje: mensaje,
                    numeroClases: numeroClases
                });
        
            })
        }
    })
});

export default clasesRouts;
