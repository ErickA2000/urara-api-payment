import { Document } from "mongoose"

export interface Icolor {
    nombre: string,
    hex: string
}

export interface IcolorDocument extends Document{
    nombre: string,
    hex: string
}