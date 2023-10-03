import { Document } from "mongoose";

export interface IPago extends Document{
    idCliente: string;
    idServiPago: string;
    servicioPago: string;
    estado: string;
    metodoPago: string;
    fechaPago: Date;
    monto: number;
}

export interface IPagoAdd {
    idCliente?: string;
    idServiPago?: string;
    servicioPago?: string
    estado?: string;
    metodoPago?: string;
    fechaPago?: Date;
    monto?: number;
}