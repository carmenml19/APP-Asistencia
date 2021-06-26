import { Router, Response, Request} from 'express';
import { AsistenciaOnline } from '../models/asistenciaOnline.model';

const asistenciaOnlineRoutes = Router();

asistenciaOnlineRoutes.post('/', (req: Request, res: Response) => {
   
    const array = req.body;
    let todoOk: boolean = true;
    let mensaje = 'Asistencia Guardada Correctamente';
    for(let objeto of array) {
        const asistenciaOnline = {
        name: objeto.name,
        username: objeto.username,
        role : objeto.role,
        tipoAsistencia: objeto.tipoAsistencia,
        fechaEntrada: objeto.fechaEntrada,
        fechaSalida: objeto.fechaSalida,
        tiempoTotal: objeto.tiempoTotal,
        numeroAccesoClase: objeto.numeroAccesoClase,
        clase: objeto.clase,
        valida: objeto.valida
        };   
    
        AsistenciaOnline.create(asistenciaOnline).then( asistenciaOnlineDB => {
        }).catch(err =>{
            todoOk = false;
            mensaje = 'Fallo al guardar asistencia error: '+err;
    
        })
    }
    res.json({
        ok: todoOk,
        usuario: mensaje
    });
});


export default asistenciaOnlineRoutes;