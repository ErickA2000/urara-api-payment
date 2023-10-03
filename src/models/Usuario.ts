import { Schema, model } from 'mongoose';
import { IUser } from '@Interfaces/usuario.interface';

const phoneSchema = new Schema({
    codigo_area: String,
    numero: String
},
{
    _id: false,
    versionKey: false
});

const metodoSchema = new Schema({
    tipo: String,
    estado: Boolean
},{
    _id: false,
    timestamps: false
})

const verify2faSchema = new Schema({
    estado: Boolean,
    fechaActivacion: Date,
    metodos: [metodoSchema],
    code_access: String
},{
    _id: false,
    timestamps: false
})

const direccionSchema = new Schema({
    titulo: String,
    pais: String,
    departamento: String,
    ciudad: String,
    direccion: String,
    especificacionOpcional: String
},{
    _id: false,
    timestamps: false
})

const usuarioSchema = new Schema<IUser>({
    nombre: {
        type: String
    },
    telefono: phoneSchema,
    email: {
        type: String,
        unique: true,
        required: true
    },
    username: {
        type: String,
        unique: true
    },
    clave: {
        type: String,
        required: true
    },
    emailverified: {
        type: Boolean,
        default: false
    },
    roles: [{
        ref: "Role",
        type: Schema.Types.ObjectId
    }],
    verify2fa: verify2faSchema,
    direcciones: [direccionSchema]
},{
    timestamps: true,
    versionKey: false,
})

export default model<IUser>("User", usuarioSchema);