import { Document } from "mongoose"

export interface Iprenda {
    nombre?: string,
    referencia?: string,
    slug?: string,
    imagenUrl?: [string],
    descripcion?: string,
    tallasCantidadPrecio?: [tallaCantidadPrecio],
    descuento?: number,
    estado?: string,
    categoria?: any
}

export interface IprendaDocument extends Document{
    nombre: string,
    referencia: string,
    slug: string,
    imagenUrl: [string],
    descripcion: string,
    tallasCantidadPrecio: [tallaCantidadPrecio],
    descuento: number,
    estado: string,
    categoria: any
}

interface tallaCantidadPrecio extends Document{
    talla: any,
    cantidad: number,
    precio: number,
    colores: [ color ]    
}

interface color extends Document{
    idColor: string,
    cantidad: number
}

export interface FindOptions{
    categoria?: string;
    
}