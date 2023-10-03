import { Document } from "mongoose";

export interface IRol extends Document {
    nombre: string
}

export interface OptionsFind{
    findBy: "id" | "nombre"
}