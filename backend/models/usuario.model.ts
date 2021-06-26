import { Schema, model, Document } from 'mongoose'
import bcrypt from 'bcrypt';


const userSchema = new Schema ({
    email: {
        type: String,
        required: [true, 'El email es necesario'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
    },
    facultad: {
        type: String,
    }
});

userSchema.method('compararPassword', function ( pass: string = '', password: string = ''): boolean {
    if (bcrypt.compareSync(pass, password)) {
        return true;
    } else {
        return false;
    }
});
interface IUsuario extends Document {
    email: string;
    password: string;
    facultad: string;
    compararPassword(password: string): boolean;
}

export const Usuario = model<IUsuario>('Usuario', userSchema);