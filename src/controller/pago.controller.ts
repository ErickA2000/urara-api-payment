import { CODES_HTTP } from "@Constants/global";
import { pagoDAO } from "@DAO/Pago.dao";
import { Request, Response } from "express";

class PagoController{

    public async getAll( req: Request, res: Response ){
        try {
            const pagos = await pagoDAO.getAll();
            res.status(CODES_HTTP.OK).json({
                success: true,
                data: pagos
            })
        } catch (error) {
            return res.status(CODES_HTTP.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error
            })
        }
    }

    public async getAllPaginate( req: Request, res: Response){
        const limit: number = req.query.limit as unknown as number || 5;
        const page: number = req.query.page as unknown as number || 1;

        try {
            const pagos = await pagoDAO.getAllPaginate( page, limit );
            res.status(CODES_HTTP.OK).json({
                success: true,
                data: pagos
            })
        } catch (error) {
            return res.status(CODES_HTTP.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error
            })
        }
    }

    public async getPagoByCliente( req: Request, res: Response ){
        try {
            const pago = await pagoDAO.getOneByCliente( req.userId );

            res.status(CODES_HTTP.OK).json({
                success: true,
                data: pago
            })
        } catch (error) {
            return res.status(CODES_HTTP.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error
            })
        }
    }
}

export const pagoController = new PagoController();