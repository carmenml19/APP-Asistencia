import { Schema, model, Document } from 'mongoose'


const notasSchema = new Schema ({
    nombre: {
        type: String,
    },
    clase: {
        type: String,
        required: [true, 'La clase es necesaria'],
    },
    notaOrdinaria: {
        type: String,
    },
    notaExtraordinaria: {
        type: String,
    },
    asistenciaTotal: {
        type: Number,
    },
    notaFinalOrdinaria: {
        type: Number,
    },
    notaFinalExtraordinaria: {
        type: Number,
    },
    bonificacion: {
        type: Number,
    },
    aplica: {
        type: Boolean,
    },
    fechaNota: {
        type: Date,
        required: [true, 'La fecha es necesaria'],
    },
    numeroUltimaNota: {
        type: Number,
        required: [true, 'La fecha es necesaria'],
    }

});

interface INotas extends Document {
    nombre: string;
    notaOrdinaria: string;
    notaExtraordinaria: string;
    asistenciaTotal: number;
    notaFinalOrdinaria: number;
    notaFinalExtraordinaria: number;
    bonificacion: number;
    aplica: boolean;
    fechaNota: Date;
    numeroUltimaNota: number;
}

export const Notas = model<INotas>('Notas', notasSchema);