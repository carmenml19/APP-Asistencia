import { Schema, model, Document } from 'mongoose'


const clasesSchema = new Schema ({
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

interface IClase extends Document {
    nombreClase: string;
    numeroAsistenciasPasadasOnline: string;
    numeroAsistenciasPasadasPresenciales: string;
    facultad: string;
}

export const Clases = model<IClase>('Clases', clasesSchema);