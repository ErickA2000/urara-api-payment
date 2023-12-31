import { CODES_HTTP } from "@Constants/global";
import { carritoDAO } from "@DAO/Carrito.dao";
import { ICarritoAdd, ICarritoPopulate } from "@Interfaces/carrito.interface";
import { Iproductos } from "@Interfaces/compra.interfaces";
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
            const carrito = await carritoDAO.getOneByClientePopulate( req.userId );

            if( !carrito ) throw "Carrito no encontrado";

            res.status(CODES_HTTP.OK).json({
                success: true,
                data: {
                    cart: carrito,
                    quantity: carrito.productos.length
                }
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
        let cartQuantity: number = 0;;
        try {

            const cart = await carritoDAO.getOneByCliente( req.userId );

            if( !cart ){
                const addCart: ICarritoAdd = {
                    cliente: req.userId,
                    productos: [productos]
                };

                await carritoDAO.addCart( addCart );
            }else{

                let isNew = false;
                let i = 0;
                
                for( let product of cart.productos ){

                    if( product.productID == productos.productID && product.tallasCantidadPrecio.idColor == productos.tallasCantidadPrecio.idColor &&
                        product.tallasCantidadPrecio.talla == productos.tallasCantidadPrecio.talla ){
                        isNew = false;
                        
                        cart.productos[i].tallasCantidadPrecio.cantidad += productos.tallasCantidadPrecio.cantidad;
                        break;
                    }else{
                        isNew = true;
                    }

                    i++;
                }

                let productosArray: Iproductos[] = cart.productos;

                if( productosArray.length === 0 ) isNew = true;
                if( isNew ) productosArray.push(productos);
                

                const updateCart: ICarritoAdd = {
                    cliente: req.userId,
                    productos: productosArray
                };

                cartQuantity = (await carritoDAO.updateCart( req.userId, updateCart )).productos.length;
            }


            res.status(CODES_HTTP.OK).json({
                success: true,
                message: "Producto agregado al carrito ",
                data: {
                    quantity: cartQuantity
                }
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
            
            const cart = await carritoDAO.updateCart( req.userId, req.body );
            
            res.status(CODES_HTTP.OK).json({
                success: true,
                message: "Carrito actualizado",
                data: {
                    quantity: cart.productos.length
                }
            });
        } catch (error) {
            return res.status(CODES_HTTP.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Error al actualizar carrito -> " + error
            })
        }
    }

    public async deleteProductOfCart( req: Request, res: Response ){
        const ID  = req.params.ID as unknown as number;

        try {

            const cart = await carritoDAO.getOneByCliente( req.userId );
            
            if( ID >= cart.productos.length ) throw Error("Posición de producto no valida");

            cart.productos.splice( ID, 1 );

            const tempCart: ICarritoAdd = {
                cliente: req.userId,
                productos: cart.productos
            }

            const newCart = await carritoDAO.updateCart( req.userId, tempCart );

            res.status(CODES_HTTP.OK).json({
                success: true,
                message: "Producto eliminado del carrito",
                data: {
                    cart: newCart,
                    quantity: newCart.productos.length
                }
            });
            
        } catch (error) {
            return res.status(CODES_HTTP.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Error al eliminar producto:" + error
            })
        }
    }

}

export const carritoController = new CarritoController();