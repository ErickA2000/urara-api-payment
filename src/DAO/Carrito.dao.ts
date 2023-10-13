import { ICarritoPopulate, ICarritoAdd, ICarrito } from "@Interfaces/carrito.interface";
import { productos2 } from "@Interfaces/compra.interfaces";
import { IUser } from "@Interfaces/usuario.interface";
import Carrito from "@Models/Carrito";
import { PaginateResult } from "mongoose";

class CarritoDAO{

    async getAll(): Promise<ICarritoPopulate[]>{
        return new Promise( (resolve, reject) => Carrito
            .find()
            .populate<{ cliente: IUser }>({ path: 'cliente', select: 'nombre' })
            .populate<{ productos: productos2[] }>({ path: "productos.productID", model: 'Prenda', select: 'nombre tallasCantidadPrecio descuento imagenUrl estado'})
            .exec( ( err, docs) => {
                if (err) return reject(err);
                return resolve(docs);
            } )
        );
    }

    async getAllPaginate( page: number, limit: number ): Promise<PaginateResult<ICarritoPopulate>>{
        const options = {
            populate: [{ path: 'cliente', select: 'nombre' },
            { path: "productos.productID", model: 'Prenda', select: 'nombre tallasCantidadPrecio descuento imagenUrl estado'}
            ],
            page,
            limit
        };

        return new Promise( (resolve, reject) => Carrito
            .paginate({}, options, (err, docs) => {
                if (err) return reject(err);
                return resolve(docs)
            })
        );
    }

    async getOneByClientePopulate( id_cliente: string ): Promise<ICarritoPopulate>{
        return new Promise( (resolve, reject) => Carrito
            .findOne({ cliente: id_cliente })
            .populate<{ cliente: IUser }>({ path: 'cliente', select: 'nombre' })
            .populate<{ productos: productos2[] }>({ path: "productos.productID", model: 'Prenda', select: 'nombre tallasCantidadPrecio descuento imagenUrl estado'})
            .populate({ path: "productos.tallasCantidadPrecio.idColor", model: "Color",})
            .exec( ( err, docs) => {
                if (err) return reject(err);
                return resolve(docs!);
            })
        );
    }

    async getOneByCliente( id_cliente: string ): Promise<ICarrito>{
        return new Promise( (resolve, reject) => Carrito
            .findOne({ cliente: id_cliente })
            .exec( ( err, docs) => {
                if (err) return reject(err);
                return resolve(docs!);
            })
        );
    }

    async addCart( cart: ICarritoAdd ){
        return new Promise( (resolve, reject) => Carrito
            .insertMany( cart, (err, docs) => {
                if(err) return reject(err);
                return resolve(docs)
            })
        );
    }

    async updateCart( id: string, cart: ICarritoAdd ): Promise<ICarritoPopulate>{
        const filter = { cliente: id };
        return new Promise( ( resolve, reject) => Carrito
            .findOneAndUpdate(
                filter, cart,
                {
                    new: true,
                },
                (err, docs) => {
                    if(err) return reject(err);
                    return resolve(docs!);
                }
            )
        )
    }

}

export const carritoDAO = new CarritoDAO();