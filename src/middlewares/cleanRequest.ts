import { Request, Response, NextFunction } from 'express';

function clean( typeData: string[], req: Request ){
    const keys = Object.keys(req.body);
    const clean: any = {};
    
    for( let key of keys ){
        for( let nameProperti of typeData ){
            if( key === nameProperti ){
                clean[key] = req.body[key];
            }
        }
    }

    return clean;
}

export const cleanCompra = ( req: Request, res: Response, next: NextFunction ) => {
    
    const typeDataCompra = ["cliente",  "telefono",   "vendedor",   "productos",   "direccionFacturacion",   "subtotal",   "descuento",   "iva",   
        "iva_moneda",   "domicilio",   "total",   "formaPago",   "observaciones",   "estado",   "isCambioEstado", "servicioPago"];
    
    const cleanCompra = clean(typeDataCompra, req);

    req.body = cleanCompra;
    
    next();
}

export const cleanPayment = ( req: Request, res: Response, next: NextFunction ) => {
    
    const typeDataPayment = ["cliente",   "vendedor",   "productos",  "products", "direccionFacturacion",   "subtotal",   "descuento",   "iva",   
        "iva_moneda", "total", "payservice"];
    
    const cleanPayment = clean(typeDataPayment, req);

    req.body = cleanPayment;
    
    next();
}

export const cleanCarrito = ( req: Request, res: Response, next: NextFunction ) => {
    
    const typeDataCarrito = [ "cliente", "productos"];

    const cleanCarrito = clean(typeDataCarrito, req);

    req.body = cleanCarrito;

    next();
}