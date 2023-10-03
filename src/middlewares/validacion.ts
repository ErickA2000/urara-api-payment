import { Request, Response, NextFunction } from 'express'
import { listParams } from '@Constants/global';
import { CODES_HTTP } from '@Constants/global';


export const verificarCampoObligatoriosCompra = async ( req: Request, res: Response, next: NextFunction ) => {
    const { cliente, vendedor, productos, direccionFacturacion, total, formaPago } = req.body;

    if( cliente === undefined || !cliente ){
        return res.status(CODES_HTTP.BAD_REQUEST).json({
            success: false,
            message: "Falta el cliente"
        })
    }else if( vendedor === undefined || !vendedor ){
        return res.status(CODES_HTTP.BAD_REQUEST).json({
            success: false,
            message: "Falta el vendedor"
        })
    }else if( productos === undefined || direccionFacturacion === undefined || total === undefined || formaPago === undefined ||
        productos.length === 0 || !direccionFacturacion || !total || !formaPago ){
        return res.status(CODES_HTTP.BAD_REQUEST).json({
            success: false,
            message: "Faltan datos obligatorios"
        })
    }
    next();
}

export const verificarLongitud_id = ( req: Request, res: Response, next: NextFunction ) => {
    const _id = req.params;
    const message = "ID incorrecto";
    const keys = Object.keys(_id);

    for( let key of keys ){
        for( let param of listParams ){
            
            if( key == param ){
                
                if(_id[key].length < 24 || _id[key].length > 24) return res.status(CODES_HTTP.BAD_REQUEST).json({
                    success: false,
                    message
                })
            }
    
        }

    }
    
    next();
}