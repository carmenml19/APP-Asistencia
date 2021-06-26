import { Router, Response, Request} from 'express';
import { Notas } from '../models/notas.model';

const notasRoutes = Router();

notasRoutes.post('/', (req: Request, res: Response) => {
   
    const array = req.body;
    let todoOk: boolean = true;
    let mensaje = 'Asistencia Guardada Correctamente';
    for(let objeto of array) {
        const nota = {
            nombre: objeto.nombre,
            notaOrdinaria: objeto.notaOrdinaria,
            notaExtraordinaria: objeto.notaExtraordinaria,
            asistenciaTotal: objeto.asistenciaTotal,
            notaFinalOrdinaria: objeto.notaFinalOrdinaria,
            notaFinalExtraordinaria: objeto.notaFinalExtraordinaria,
            bonificacion: objeto.bonificacion,
            aplica: objeto.aplica,
            clase: objeto.clase,
            fechaNota: objeto.fechaNota,
            numeroUltimaNota: objeto.numeroUltimaNota
        };   
    
        Notas.create(nota).then( notaDB => {
        }).catch(err =>{
            todoOk = false;
            mensaje = 'Fallo al guardar asistencia error: ', err;
    
        })
    }
    res.json({
        ok: todoOk,
        usuario: mensaje
    });
});

notasRoutes.post('/listarNotas', (req: Request, res: Response) => {
   
    let todoOk: boolean = true;
    let mensaje = 'Listado notas cargado correctamente';

    const clase = req.body.nombreClase;
    console.log('CLASE: ', req.body)

    Notas.find({ "clase": clase }).sort({fechaNota: -1}).then( lista => {
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
export default notasRoutes;