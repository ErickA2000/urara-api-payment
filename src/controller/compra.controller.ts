import { Request, Response } from "express";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import fs from "fs";
import path from "node:path";
import imageToBase64 from "image-to-base64";
import { format } from "date-fns";

import { encryptAndDecryptData } from "@Utils/encryptAndDecryptData";
import { env } from "@Constants/global";
import { generateArrayData } from "@Utils/functions";
import { compraDAO } from "@DAO/Compra.dao";
import { counterDAO } from "@DAO/Counter.dao";
import { prendaDAO } from "@DAO/Prenda.dao";
import getNextSequenceValue from "@Helpers/getSequenceFactura";
import { CODES_HTTP } from "@Constants/global";
import { Iproductos } from "@Interfaces/compra.interfaces";

const showCompraLog = require('../util/logger/logger.compra');

class CompraController {

    public async getAllSellsAndBuys(req: Request, res: Response) {

        const sellsAndBuys = await compraDAO.getAll();

        let dataEncrypt: string;
        try {
            dataEncrypt = encryptAndDecryptData.encrypt(sellsAndBuys);
        } catch (error) {
            showCompraLog.warn({ message: 'Compra getAllSellsAndBuys | Error al encriptar data' });
            return res.status(CODES_HTTP.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Error al encriptar data"
            })
        }


        res.status(CODES_HTTP.OK).json({
            success: true,
            data: dataEncrypt
        })
    }

    public async getAllSellsAndBuysPaginate(req: Request, res: Response) {
        const limit: number = req.query.limit as unknown as number || 5;
        const page: number = req.query.page as unknown as number || 1;

        const sellsAndBuys = await compraDAO.getAllPaginate( page, limit );

        let dataEncrypt: string;
        try {
            dataEncrypt = encryptAndDecryptData.encrypt(sellsAndBuys);
        } catch (error) {
            showCompraLog.warn({ message: 'Compra getAllSellsAndBuys paginate | Error al encriptar data' });
            return res.status(CODES_HTTP.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Error al encriptar data"
            })
        }

        res.status(CODES_HTTP.OK).json({
            success: true,
            data: dataEncrypt
        })
    }

    public async getOneBuysById( req: Request, res: Response ){
        const { compraID } = req.params;

        try {
            
            const buys = await compraDAO.getOne( compraID );

            const dataEncrypt = encryptAndDecryptData.encrypt( buys );

            res.status(CODES_HTTP.OK).json({
                success: true,
                data: dataEncrypt
            })

        } catch (error) {
            return res.status(CODES_HTTP.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Error:" + error
            })
        }
    }

    public async getAllShoppingByUserPaginate( req: Request, res: Response ){
        const limit: number = req.query.limit as unknown as number || 5;
        const page: number = req.query.page as unknown as number || 1;

        try {
            const shopping = await compraDAO.getAllShoppingByUserPaginate( req.userId, page, limit );

            const dataEncrypt = encryptAndDecryptData.encrypt( shopping );

            res.status(CODES_HTTP.OK).json({
                success: true,
                data: dataEncrypt
            });
        } catch (error) {
            return res.status(CODES_HTTP.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Error: " + error
            })
        }
    }

    public async getNumPedido(req: Request, res: Response) {
        let nextNumPedido: string | undefined;

        const counter = await counterDAO.getNumPedido( "compraId" );

        if( !counter ) return res.status(CODES_HTTP.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Ha ocurrido un error"
        })

        const nextNumPedidoNumber = counter?.seq_value! + 1;
        nextNumPedido = nextNumPedidoNumber?.toString().padStart(16, "0");

        res.status(CODES_HTTP.OK).json({
            success: true,
            nextNumPedido: nextNumPedido
        })
    }

    public async createCompra(req: Request, res: Response) {
        const { cliente, vendedor, productos, estado } = req.body;
        
        const newBuy = req.body;
        
        if (estado === undefined || !estado) {
            newBuy.estado = "pendiente";
        } else {
            newBuy.estado = estado;
        }

        //falta agregar funcionalidad de agregar datos a pago
        
        //agregando numero de factura
        await getNextSequenceValue("compraId")
            .then( numFactura => {
                newBuy.numFactura = numFactura?.toString().padStart(16, "0")
            } )
            .catch( err => {
                return res.status(CODES_HTTP.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: "Error al generar número de factura. Error ->" + err
                })
            } )

        //buscando prendas para actualizar cantidad
        
        for (let producto of productos as Iproductos[]) {
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
          

        compraDAO.createBuy( newBuy );
        showCompraLog.info({ message: `createCompra | Nueva compra realizada -> cliente - ${cliente}, vendedor - ${vendedor}` })
        res.status(CODES_HTTP.CREATED).json({
            success: true,
            message: "Nueva compra realizada"
        });
    }

    public async cambioEstadoCompra(req: Request, res: Response) {
        const { estado } = req.body;
        let cambio = { estado: estado, isCambioEstado: true };

        const compra = await compraDAO.getOneById( req.params.compraID );

        if( estado != "pagado" ) return res.status(CODES_HTTP.BAD_REQUEST).json({
            seccess: false,
            message: "Estado invalido"
        })

        if (compra?.isCambioEstado != false) return res.status(CODES_HTTP.BAD_REQUEST).json({
            success: false,
            message: "No se puede cambiar el estado"
        })

        await compraDAO.updateBuy( req.params.compraID, cambio );

        showCompraLog.info({ message: `Cambio Estado compra | Realizo el cambio: ${req.userId} a la venta ${compra._id}` })
        res.status(CODES_HTTP.OK).json({
            success: true,
            message: 'Cambio de estado exitoso'
        })

    }

    public async generarPDF(req: Request, res: Response) {

        try {
            
            const compra = await compraDAO.getOne( req.params.compraID );
    
            if(!compra) return res.status(CODES_HTTP.NO_FOUND).json({
                success: false,
                message: "No se encontro factura"
            })
            
            const filename = `Factura_${Date.now()}.pdf`;
    
            const doc = new jsPDF({
                orientation: "portrait",
                format: "a4",
                compress: true
            });
    
            const infoUrara = env.infoUrara;
            const imgPath = path.join(__dirname + "../../../assets/img/logo_urara.png");
            let imgBase64 = "";
    
            await imageToBase64(imgPath)
                .then((res) => {
                    imgBase64 = res;
    
                })
                .catch((error) => {
                    return res.status(CODES_HTTP.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: `Error convertir imagen a base 64 -> ${error}`
                    })
                });
    
            doc.addImage(imgBase64, "PNG", 70, 15, 70, 25);
            doc.setFont("times", "italic")
                .text(`Nit: ${infoUrara.nit}`, 15, 45)
                .text(`${infoUrara.direccion}`, 15, 51)
                .text(`${infoUrara.ubicacion}`, 15, 58)
                .text(`Telefono: +57 ${infoUrara.telefono}`, 15, 65)
                .text(`Factura N° ${compra?.numFactura}`, 200, 55, { align: "right" })
    
    
            doc.text(`Cliente: ${compra?.cliente.nombre}`, 15, 80)
    
            if (compra?.telefono == null) {
                doc.text(`Telefono: `, 15, 86)
            } else {
                doc.text(`Telefono: ${compra?.telefono.codigo_area} ${compra?.telefono.numero}`, 15, 86)
            }
    
            doc.text(`Dirección: Barrio ${compra?.direccionFacturacion.barrio}, ${compra.direccionFacturacion.tipocalle} ${compra.direccionFacturacion.callenumero}`+
            `#${compra.direccionFacturacion.numero1}-${compra.direccionFacturacion.numero2}`, 15, 92);

            doc.text(`${compra?.direccionFacturacion.ciudad}, ${compra?.direccionFacturacion.departamento}, ${compra?.direccionFacturacion.pais}`, 15, 98);
    
            if (compra?.direccionFacturacion.especificacionOpcional == null) {
                doc.text(`Referencias adicionales: `, 15, 104)
            } else {
                doc.text(`Referencias adicionales: ${compra?.direccionFacturacion.especificacionOpcional}`, 15, 104)
            }
    
            const fechaVenta = format(compra?.createdAt!, "dd/MM/yyyy");
    
            doc.text(`Forma de pago: ${compra?.idPago.metodoPago}`, 15, 110)
                .text(`Fecha de compra: ${fechaVenta}`, 15, 118);
    
            const headers = ["Cantidad", "Producto", "Talla", "Valor_unitario", "Descuento"]
            let finalY = 115;
            
            autoTable(doc, {
                startY: finalY + 10,
                head: [headers],
                body: generateArrayData(compra?.productos!),
                styles: {
                    halign: "center"
                },
                headStyles: {
                    fillColor: "#F40ACF"
                }
            })
            finalY = (doc as any).lastAutoTable.finalY;
            let sumY = 10;
            doc.text(`Subtotal: $ ${compra?.subtotal}`, 15, finalY + sumY)
                .text(`Descuento: $ ${compra?.descuento}`, 15, finalY + (sumY += 7))
                .text(`Iva: ${compra?.iva}%`, 15, finalY + (sumY += 7))
                .text(`Valor iva: ${compra?.iva_moneda}`, 15, finalY + (sumY += 7))
                .text(`Envio: ${compra?.idEnvio.montoEnvio || ""}`, 15, finalY + (sumY += 7))
                .text(`Total: $ ${compra?.total}`, 15, finalY + (sumY += 7))
    
            //crear pdf
            const pdfData = doc.output();
            fs.writeFileSync(filename, pdfData, 'binary')
    
            const ruta = path.join(__dirname + `../../../${filename}`);
            showCompraLog.info({ message: `Generando PDF | Generador: ${ req.userId } de la compra/venta ${ req.params.compraID }` });
    
            res.header({
                "Content-Type": "application/pdf",
                "Content-disposition": `attachment;filename=${filename}`,
                "filname": `${filename}`,
                "access-control-expose-headers": ["filname"]
            }).download(ruta, filename, (err) => {
                showCompraLog.warn({ message: 'Generando PDF | Error al descargar pdf' });
                if (err) return res.json({ error: err })
                fs.unlinkSync(ruta)
            })
        } catch (error) {
            return res.status(CODES_HTTP.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Error al generar pdf:" + error
            });
        }

    }

}

export const compraController = new CompraController();