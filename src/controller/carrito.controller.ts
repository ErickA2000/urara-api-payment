import { CODES_HTTP } from "@Constants/global";
import { carritoDAO } from "@DAO/Carrito.dao";
import { Request, Response } from "express";

class CarritoController{

    public async getAll( req: Request, res: Response ){
        try {
            const carritos = await carritoDAO.getAll();
            res.status(CODES_HTTP.OK).json({
                succes: true,
                data: carritos
            })
        } catch (error) {
            return res.status(CODES_HTTP.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Error al obtener carritos ->" + error
            })
        }
    }

    public async getAllPaginate( req: Request, res: Response ){
        const limit: number = req.query.limit as unknown as number || 5;
        const page: number = req.query.page as unknown as number || 1;

        try {
            const carritos = await carritoDAO.getAllPaginate( page, limit );
            res.status(CODES_HTTP.OK).json({
                success: true,
                data: carritos
            })
        } catch (error) {
            return res.status(CODES_HTTP.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Error al obtener carritos -> " + error
            })
        }
    }

    public async getOneByCliente( req: Request, res: Response ){
        try {
            const carrito = await carritoDAO.getOneByCliente( req.userId );

            if( !carrito ) throw "Carrito no encontrado";

            res.status(CODES_HTTP.OK).json({
                success: true,
                data: carrito
            })

        } catch (error) {
            return res.status(CODES_HTTP.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Error al obtener carrito -> " + error 
            });
        }
    }

    public async addCart( req: Request, res: Response ){
        const { productos } = req.body;
        
        try {

            const cart = await carritoDAO.getOneByCliente( req.userId );

            if( !cart ){

                await carritoDAO.addCart( { cliente: req.userId , productos } );
            }else{
                await carritoDAO.updateCart( req.userId, { cliente: req.userId, productos } );
            }


            res.status(CODES_HTTP.OK).json({
                success: true,
                message: "Nuevo carrito creado"
            })
        } catch (error) {
            return res.status(CODES_HTTP.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Error al crear carrito -> " + error
            })
        }
    }

    public async updateCart( req: Request, res: Response ){
        try {
            
            await carritoDAO.updateCart( req.userId, req.body );
            
            res.status(CODES_HTTP.OK).json({
                success: true,
                message: "Carrito actualizado"
            });
        } catch (error) {
            return res.status(CODES_HTTP.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Error al actualizar carrito -> " + error
            })
        }
    }

}

export const carritoController = new CarritoController();