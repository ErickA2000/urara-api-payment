import { Icompra, Icompra2, IcompraUpdate, productos2 } from "@Interfaces/compra.interfaces";
import { IUser } from "@Interfaces/usuario.interface";
import Compra from "@Models/Compra";

class CompraDAO {

    async getAll(){
        return new Promise( (resolve, reject) => Compra
            .find().populate({ path: 'cliente', select: 'nombre' })
            .populate({ path: 'vendedor', select: 'username' })
            .populate({ path: 'productos.productID', model: 'Prenda', select: 'nombre referencia' })
            .exec( (err, docs) => {
                if(err) return reject(err);
                return resolve(docs);
            } )
        )
    }

    async getAllPaginate( page: number, limit: number ){
        const options = {
            populate: [{ path: 'cliente', select: 'nombre' }, { path: 'vendedor', select: 'username' }, { path: 'productos.productID', model: 'Prenda', select: 'nombre referencia' }],
            page,
            limit
        };

        return new Promise( (resolve, reject) => Compra
            .paginate({}, options, (err, docs) => {
                if(err) return reject(err);
                return resolve(docs);
            })
        )
    }

    async getOne( id: string ): Promise<any>{
        return new Promise( (resolve, reject) => Compra
            .findOne({ _id: id })
            .populate<{ cliente: IUser }>({ path: 'cliente', select: 'nombre', model: "User"})
            .populate<{ vendedor: IUser }>({ path: 'vendedor', select: 'nombre', model: "User"})
            .populate<{ productos: productos2[] }>({ path: 'productos.productID', model: 'Prenda', select: 'nombre referencia imagenUrl' })
            .populate( { path: 'idPago', model: "Pago" } )
            // .populate( { path: "idEnvio", model: "Envio" } )
            .exec( (err, docs) => {
                if(err) return reject(err);
                return resolve(docs!);
            } )
        )
    }

    async getOneById( id: string ): Promise<Icompra>{
        return new Promise( (resolve, reject) => Compra
            .findById( id )
            
            .exec( (err, docs) => {
                if(err) return reject(err);
                return resolve(docs!);
            } )
        )
    }

    async getAllShoppingByUserPaginate( id_cliente: string, page: number, limit: number ){
        const options = {
            populate: [ { path: "productos.productID", model: "Prenda", select: "nombre imagenUrl" },
            { path: "idEnvio", model: "Envio" } ],
            page,
            limit
        };

        return new Promise( (resolve, reject) => Compra
            .paginate( { cliente: id_cliente }, { ...options, sort: '-createdAt' }, (err, docs) => {
                if( err ) return reject(err)
                return resolve(docs)
            } )
        )
    }

    async getOneByNumFactura( numFactura: string ): Promise<Icompra>{
        return new Promise( (resolve, reject) => Compra
            .findOne( { numFactura } )
            .exec( (err, docs) => {
                if(err) return reject(err);
                return resolve(docs!);
            } )
        )
    }

    async createBuy( compra: Object ): Promise<Icompra[]>{
        return new Promise( (resolve, reject) => Compra.insertMany( compra, (err, docs) => {
            if(err) return reject(err);
            return resolve(docs);
        } )
        )
    }

    async updateBuy( id: string, data: Object ): Promise<Icompra>{
        return new Promise( (resolve, reject) => Compra
            .findByIdAndUpdate( 
                id, data,
                {
                    new: true
                },
                (err, docs) => {
                    if(err) return reject(err);
                    return resolve(docs!);
                }
            )
        )
    }

}

export const compraDAO = new CompraDAO();