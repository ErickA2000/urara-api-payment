import { Document, Model } from "mongoose"

export interface IUser extends Document{
    nombre: string,
    telefono: Iphone,
    email: string,
    username: string,
    clave: string,
    emailverified: boolean,
    roles: any,
    verify2fa: Iverify2fa
    direcciones: Idireccion[]
}

export interface IUserOptional extends Document{
    nombre?: string,
    telefono?: Iphone,
    email?: string,
    username?: string,
    clave?: string,
    emailverified?: boolean,
    roles?: any
    verify2fa?: Iverify2fa
}

export interface Iphone {
    codigo_area: string,
    numero: string
}

export interface Iverify2fa{
    estado: boolean;
    fechaActivacion?: Date,
    metodos: ImetodoVerify[],
    code_access: string
}

interface ImetodoVerify{
    tipo: string;
    estado: boolean
}

interface Idireccion{
    titulo: string,
    pais: string,
    departamento: string,
    ciudad: string,
    direccion: string,
    especificacionOpcional: string
}

export interface IUserModel extends Model<IUser>{
    encryptClave: ( clave: string ) => Promise<string>
    compareClave: ( clave: string, claveRecibida: string ) => Promise<boolean>
}