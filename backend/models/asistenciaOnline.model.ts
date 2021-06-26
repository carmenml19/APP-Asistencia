import { Schema, model, Document } from 'mongoose'


const asistenciaOnlineSchema = new Schema ({
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

interface IAsistenciaOnline extends Document {
    name: string;
    username: string;
    role: string; 
    tipoAsistencia: string;
    fechaEntrada: string;
    fechaSalida: string;
    tiempoTotal: string;
    numeroAccesoClase: string;
    clase: string;
    asiste: boolean;
    valida: boolean;
}

export const AsistenciaOnline = model<IAsistenciaOnline>('AsistenciaOnline', asistenciaOnlineSchema);