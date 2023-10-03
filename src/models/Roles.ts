import { Schema, model } from 'mongoose'
import { IRol } from '@Interfaces/rol.interface';

const rolesSchema = new Schema({
    nombre: String
},{
    versionKey: false
})

export default model<IRol>("Role", rolesSchema)