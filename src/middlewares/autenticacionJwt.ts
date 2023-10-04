import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken';
import { usuarioDao } from '@DAO/Usuario.dao';
import { CODES_HTTP } from '@Constants/global';

interface IPayload {
    _id: string;
    iat: number;
    exp: number;
}

export const TokenValidation = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const token = req.header('token');
        if( !token ) return res.status(CODES_HTTP.UNAUTHORIZED).json({
            success: false,
            message: 'Acceso denegado'
        })

        const payload = jwt.verify(token, process.env.TOKEN_SECRET || 'tokentest') as IPayload;
        req.userId = payload._id;

        const user = usuarioDao.getOneById( req.userId );
        if( !user ) return res.status(CODES_HTTP.NO_FOUND).json({ 
            success: false,
            messaje: "No existe el usuario" 
        });
    
        next();
    } catch (error) {
        res.status(CODES_HTTP.UNAUTHORIZED).json({ 
            success: false,
            message: "Sin autorización" 
        })
    }
}

export const isAdmin = async ( req: Request, res: Response, next: NextFunction ) => {
    
    try {
        
        const user = await usuarioDao.getOneById( req.userId );
        
        for( let rol of user.roles ){
            if(rol.nombre === "admin"){
                next();
                return;
            }
        }
    
        res.status(CODES_HTTP.FORBIDDEN).json({ 
            success: false,
            message: "Requiere rol admin" 
        });
    } catch (error) {
        return res.status(CODES_HTTP.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error: " + error 
        }) 
    }

}

export const isModerador = async ( req: Request, res: Response, next: NextFunction ) => {
    
    try {
        
        const user = await usuarioDao.getOneById( req.userId );
    
        for( let rol of user.roles ){
            if(rol.nombre === "moderador"){
                next();
                return;
            }
        }
    
        res.status(CODES_HTTP.FORBIDDEN).json({ 
            success: false,
            message: "Requiere rol moderador" 
        });
    } catch (error) {
        return res.status(CODES_HTTP.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error: " + error 
        })
    }
}

export const isAdminOrModerador = async ( req: Request, res: Response, next: NextFunction ) => {
    
    try {
        
        const user = await usuarioDao.getOneById( req.userId );
        
    
        for( let rol of user.roles ){
            if(rol.nombre === "admin" || rol.nombre === "moderador" ){
                next();
                return;
            }
        }
    
        res.status(CODES_HTTP.FORBIDDEN).json({ 
            success: false,
            message: "Requiere rol admin o moderador" 
        });
    } catch (error) {
        return res.status(CODES_HTTP.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error: " + error 
        })
    }

}