import { Request, Response } from "express";
import { mercadoPagoService } from "@Services/mercadopago";
import { CODES_HTTP, PAYMENT_STATUS } from "@Constants/global";
import { prendaDAO } from "@DAO/Prenda.dao";
import getNextSequenceValue from "@Helpers/getSequenceFactura";
import { compraDAO } from "@DAO/Compra.dao";
import { IResponseMercadoPago, PayMercadopago } from "@Interfaces/payment.interfaces";
import { Icompra, Iproductos } from "@Interfaces/compra.interfaces";
import { pagoDAO } from "@DAO/Pago.dao";
import ProducerFactory from "@Services/kafkaProducer";
// import { envioDAO } from "@DAO/Envio.dao";

const showCompraLog = require('../util/logger/logger.compra');

class PaymentController {

    public async payment(req: Request, res: Response) {
        const { vendedor } = req.body;
        const payment = req.body;

        const producer = new ProducerFactory();
        await producer.start();

        if (payment.payservice == "mercadopago") {

            try {

                 //buscando prendas para comprobar cantidad
                 for (let producto of payment.productos as Iproductos[]) {
                    const foundPrenda = await prendaDAO.getOneById( producto.productID );
                    
                    for (let tallaCantidadPrecio of foundPrenda?.tallasCantidadPrecio!) {
                        
                        if (producto.tallasCantidadPrecio.talla == tallaCantidadPrecio.talla) {
                            
                            for( let color of tallaCantidadPrecio.colores ){
                                
                                if( producto.tallasCantidadPrecio.idColor == color.idColor ){
                                    
                                    if(  color.cantidad < producto.tallasCantidadPrecio.cantidad ){
                                        return res.status(CODES_HTTP.BAD_REQUEST).json({
                                            success: false,
                                            message: "Cantidad de prendas insuficiente"
                                        });
                                    }

                                    color.cantidad -= producto.tallasCantidadPrecio.cantidad;
                                    tallaCantidadPrecio.cantidad -= producto.tallasCantidadPrecio.cantidad;
                        
                                    await prendaDAO.updateById( foundPrenda._id, foundPrenda );
            
                                }
                            }
                        }
                    }
                }

                //agregando numero de factura
                let numFactu: any;
                await getNextSequenceValue("compraId")
                    .then(numFactura => {
                        if( !numFactura ){
                            throw "Numero de factura indefinido";
                        }
                        numFactu = numFactura?.toString().padStart(16, "0")
                    })
                    .catch(err => {
                        return res.status(CODES_HTTP.INTERNAL_SERVER_ERROR).json({
                            success: false,
                            message: "Error al generar número de factura. Error ->" + err
                        })
                    })

                const resul = await mercadoPagoService.createOrder({...payment, cliente: req.userId}, numFactu!);
                
                const payservice = payment.payservice;
                delete payment.payservice;
                delete payment.products;

                //creando registro de pago
                const pago = await pagoDAO.addPayment( {
                    idCliente: req.userId,
                    idServiPago: "",
                    servicioPago: payservice,
                    estado: "pendiente",
                    metodoPago: "",
                    monto: 0
                } );

                //creando registro de envio
                // const envio = await envioDAO.addShipment( {
                //     idCliente: req.userId,
                //     tokenServiEnvio: "",
                //     estado: "pendiente",
                //     paqueteria: "",
                //     montoEnvio: 0
                // });

                const newBuy = payment as Icompra;
                newBuy.numFactura = numFactu;
                newBuy.estado = "pendiente";
                newBuy.cliente = req.userId;
                newBuy.idPago = pago[0]._id;
                newBuy.idEnvio = "" //envio[0]._id;
                newBuy.isCambioEstado = false;

                

                await compraDAO.createBuy( newBuy );
                showCompraLog.info({ message: `createCompra | Nueva compra realizada -> cliente - ${req.userId}, vendedor - ${vendedor}` });

                //enviar mensaje a kafka
                await producer.sendBatch( [ { idCliente: req.userId } ] );
                await producer.shutdown();

                const dataResponse = {
                    payUrl: resul.body.init_point,
                    data: resul
                };

                return res.status(CODES_HTTP.OK).json({
                    success: true,
                    data: dataResponse
                });

            } catch (error) {
                console.log("Error al crear orden mercado pago:", error);
                return res.status(CODES_HTTP.INTERNAL_SERVER_ERROR).json({
                    sucess: false,
                    message: "Algo va mal: " + error
                })
            }
        }

        res.status(CODES_HTTP.BAD_REQUEST).json({
            sucess: false,
            message: "Servicio de pago no disponible"
        })

    }

    public async recivedWebHookMercadoPago(req: Request, res: Response) {
        const query = req.query;
        const { IDorder } = req.params;
        try {
            if (query.type === "payment") {

                const payid = query["data.id"] || 0;

                const data = await mercadoPagoService.findPayment(parseInt(payid.toString()));
                
                if (data.success === false) {
                    throw data.message
                }

                //aprobado
                if( data.status === PAYMENT_STATUS.APPROVED ){

                    if( !IDorder ){
                        throw new Error("Sin id de orden");
                    }    

                    await changeQuantityProducts( IDorder, "pagado" );     

                    await updateStateOrder( IDorder, data, "pagado" ); 
                                      
                }

                //rechazado
                if( data.status === PAYMENT_STATUS.REJECTED ){

                    if( !IDorder ){
                        throw new Error("Sin id de orden");
                    }       

                    await changeQuantityProducts( IDorder, "rechazado" );

                    await updateStateOrder( IDorder, data, "rechazado" );
                    
                                      
                }

                //pendiente
                if( data.status === PAYMENT_STATUS.IN_PROCESS || data.status === PAYMENT_STATUS.PENDING ){

                    if( !IDorder ){
                        throw new Error("Sin id de orden");
                    }                    
                    await updateStateOrder( IDorder, data, "pendiente" );   
                                     
                }

                
            }
            res.sendStatus(CODES_HTTP.NO_CONTENT);

        } catch (error) {
            console.log("error webhook mercado pago:", error);
            return res.status(CODES_HTTP.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error
            })
        }
    }

}

export const paymentController = new PaymentController();

async function updateStateOrder ( idOrder: string, dataPayment: IResponseMercadoPago, status: string ){
        
    const order = await compraDAO.getOneByNumFactura( idOrder );
    order.estado = status;
    order.total = dataPayment.transaction_amount;
    order.isCambioEstado = true;

    //actualizacion de pago
    const pago = await pagoDAO.getById( order.idPago );
    pago.estado = status;
    pago.idServiPago = dataPayment.id.toString();
    pago.fechaPago = dataPayment.date_approved;
    pago.metodoPago = dataPayment.payment_type_id;
    pago.monto = dataPayment.transaction_amount;

    await pagoDAO.updatePayment( pago._id, pago );
    
    const updateOrder = await compraDAO.updateBuy( order._id, order );
    
    return updateOrder;
    
}

async function changeQuantityProducts( idOrder: string, status?: string ): Promise<{success: boolean, message: string}>{
    try {
        const order = await compraDAO.getOneByNumFactura( idOrder );
        
        //buscando prendas para actualizar cantidad
        for (let producto of order.productos) {
            const foundPrenda = await prendaDAO.getOneById( producto.productID );
            
            for (let tallaCantidadPrecio of foundPrenda?.tallasCantidadPrecio!) {
                
                if (producto.tallasCantidadPrecio.talla == tallaCantidadPrecio.talla) {
                    
                    for( let color of tallaCantidadPrecio.colores ){
                        if( producto.tallasCantidadPrecio.idColor.toString() === color.idColor.toString() ){
                            
                            
                            if(  color.cantidad < producto.tallasCantidadPrecio.cantidad ){
                                return {
                                    success: false,
                                    message: "Cantidad de prendas insuficiente"
                                };
                            }
                            if( status == "rechazado"){

                                if( order.isCambioEstado === false ){
                                    color.cantidad += producto.tallasCantidadPrecio.cantidad;
                                    tallaCantidadPrecio.cantidad += producto.tallasCantidadPrecio.cantidad;
                        
                                    await prendaDAO.updateById( foundPrenda._id, foundPrenda );
                                }
                                
                            }
                            if( status == "pagado" ){
                                if( order.estado == "rechazado" ){

                                   
                                    color.cantidad -= producto.tallasCantidadPrecio.cantidad;
                                    tallaCantidadPrecio.cantidad -= producto.tallasCantidadPrecio.cantidad;
                        
                                    await prendaDAO.updateById( foundPrenda._id, foundPrenda );
                                    
                                }
                            }
    
                        }
                    }
                }
            }
        }
        return {
            success: true,
            message: ""
        }
        
    } catch (error) {
        return {
            success: false,
            message: `Error al cambiar cantidades: ${error}`
        }
    }
}