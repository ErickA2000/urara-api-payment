import { Document, Types } from "mongoose";
import { Iproductos, productos2 } from "./compra.interfaces";
import { IUser } from "./usuario.interface";

export interface ICarrito extends Document{
    cliente: Types.ObjectId | IUser,
    productos: [ Iproductos ] | productos2[]
}

export interface ICarritoAdd{
    cliente: string,
    productos: [ Iproductos ] | productos2[]
}