import { Router, Response, Request} from 'express';
import { AsistenciaOnline } from '../models/asistenciaOnline.model';


const asistenciaPresencialRoutes = Router();

asistenciaPresencialRoutes.post('/listarNombresAlumnos', (req: Request, res: Response) => {
   
    let todoOk: boolean = true;
    let mensaje = 'Listado alumnos cargado correctamente';

    const clase = req.body.clase;
    console.log('CLASE: ', clase)

    AsistenciaOnline.find({ "clase": clase }).distinct("name").then( lista => {
        console.log('lista: ', lista)
        res.json({
            ok: todoOk,
            mensaje: mensaje,
            lista: lista
        });
    }).catch(err =>{
        todoOk = false;
        mensaje = 'Fallo al guardar asistencia error: '+err;
        res.json({
            ok: todoOk,
            mensaje: mensaje
        });
    })
    
});

asistenciaPresencialRoutes.post('/listarAsitenciasTotales', (req: Request, res: Response) => {
   
    let todoOk: boolean = true;
    let mensaje = 'Listado alumnos cargado correctamente';

    const clase = req.body.clase;
    console.log('CLASE: ', clase)

    AsistenciaOnline.find({ "clase": clase }).then( lista => {
        console.log('lista: ', lista)
        res.json({
            ok: todoOk,
            mensaje: mensaje,
            lista: lista
        });
    }).catch(err =>{
        todoOk = false;
        mensaje = 'Fallo al guardar asistencia error: '+err;
        res.json({
            ok: todoOk,
            mensaje: mensaje
        });
    })
    
});

asistenciaPresencialRoutes.post('/marcarAsistencia', (req: Request, res: Response) => {
   
    let todoOk: boolean = true;
    let mensaje = 'Asistencia marcada correctamente';

    
    const asistenciaPresencial = {
        name: req.body.name,
        role : req.body.role,
        fechaEntrada: req.body.fechaEntrada,
        asiste: req.body.asiste,
        clase: req.body.clase
    };
    
    AsistenciaOnline.create(asistenciaPresencial).then( asistenciaPresencialBD => {



    }).catch(err =>{
        todoOk = false;
        mensaje = 'Fallo al guardar asistencia error: '+err;

    })

    res.json({
        ok: todoOk,
        mensaje: mensaje
    });
    
});  


export default asistenciaPresencialRoutes;