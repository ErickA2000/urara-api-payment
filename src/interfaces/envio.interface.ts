import { Document } from "mongoose"

export interface Ienvio extends Document{
    idCliente: string,
    tokenServiEnvio: string,
    estado: string,
    paqueteria: string,
    fechaEnvio: Date,
    fechaEntrega: Date,
    montoEnvio: number
}

export interface IenvioAdd {
    idCliente?: string,
    tokenServiEnvio?: string,
    estado?: string,
    paqueteria?: string,
    fechaEnvio?: Date,
    fechaEntrega?: Date,
    montoEnvio?: number
}