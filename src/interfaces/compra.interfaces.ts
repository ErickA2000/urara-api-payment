import { Document, Types } from "mongoose"
import { IprendaDocument } from "@Interfaces/prenda.intrfaces";
import { IUser, Iphone } from "./usuario.interface";

export interface Icompra extends Document{
    numFactura: string | undefined,
    idOrder: string,
    cliente: Types.ObjectId | string,
    telefono: Iphone,
    vendedor: Types.ObjectId,
    productos: [ Iproductos ],
    direccionFacturacion: IdireccionFacturacion,
    subtotal: number,
    descuento: number,
    iva: string,
    iva_moneda: number,
    total: number,
    observaciones?: string,
    estado: string,
    isCambioEstado: boolean,
    idPago: string,
    idEnvio: string,
    createdAt: Date
}

export interface Icompra2{
    numFactura: string | undefined,
    idOrder: string,
    cliente: IUser,
    telefono: Iphone,
    vendedor: IUser,
    productos: [ productos2 ],
    direccionFacturacion: IdireccionFacturacion,
    subtotal: number,
    descuento: number,
    iva: string,
    iva_moneda: number,
    total: number,
    observaciones?: string,
    estado: string,
    isCambioEstado: boolean,
    idPago: string,
    idEnvio: string,
    createdAt: Date
}

interface ItallaCantidadPrecio extends Document{
    talla: string,
    cantidad: number,
    precio: number,
    idColor: string
}

interface IdireccionFacturacion extends Document{
    pais: string,
    departamento: string,
    ciudad: string,
    direccion: string,
    especificacionOpcional?: string
}

export interface Iproductos extends Document{
    productID: string,
    descuento: number,
    tallasCantidadPrecio: ItallaCantidadPrecio
}

export interface productos2{
    productID: IprendaDocument,
    descuento: number,
    tallasCantidadPrecio: ItallaCantidadPrecio    
}