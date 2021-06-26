import Server from './classes/server';
import userRoutes from './routes/usuario';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import cors from 'cors';
import asistenciaOnlineRoutes from './routes/asistenciaOnline';
import asistenciaPresencialRoutes from './routes/asistenciaPresencial';
import clasesRoutes from './routes/clases';
import notasRoutes from './routes/notas';


const server = new Server();

// Body parser
server.app.use( bodyParser.urlencoded({extended: true}));
server.app.use( bodyParser.json());

//CORS
server.app.use(cors({origin: true, credentials: true}));


//Rutas de la AppAsistencia
server.app.use( '/user', userRoutes);
server.app.use( '/asistenciaOnline', asistenciaOnlineRoutes);
server.app.use( '/asistenciaPresencial', asistenciaPresencialRoutes);
server.app.use( '/clases', clasesRoutes);
server.app.use( '/notas', notasRoutes);

// Conectar DB
mongoose.connect('mongodb://localhost:27017/AppAsistencia',
    {useNewUrlParser: true, useCreateIndex: true}, ( error ) => {
        if ( error )  {
            console.log('ERROR BD: ', error);
        }

        console.log('Base de datos ONLINE');
        
    });

 
//Levantar express
server.start( () => {
    console.log(`Servidor corriendo en el puerto: ${server.port}`);
    
})