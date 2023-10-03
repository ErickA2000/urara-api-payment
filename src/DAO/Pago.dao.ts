import { IPago, IPagoAdd } from "@Interfaces/pago.interface";
import Pago from "@Models/Pago";
import { PaginateResult } from "mongoose";

class PagoDAO{

    async getAll(): Promise<IPago[]>{
        return new Promise( (resolve, reject) => Pago
            .find()
            .populate({ path: "idCliente", select: "nombre" })
            .exec( (err, docs) => {
                if(err) return reject(err);
                return resolve(docs);
            })
        )
    }

    async getAllPaginate( page: number, limit: number ): Promise<PaginateResult<IPago>>{
        const options = {
            populate: [{ path: "idCliente", select: "nombre" }],
            page,
            limit
        };

        return new Promise( (resolve, reject) => Pago
            .paginate({}, options, (err, docs) => {
                if(err) return reject(err);
                return resolve(docs);
            })
        )
    }

    async getOneByCliente( id_cliente: string ): Promise<IPago> {
        return new Promise( (resolve, reject) => Pago
            .findOne({ idCliente: id_cliente})
            .populate({ path: "idCliente", select: "nombre" })
            .exec( (err, docs) => {
                if(err) return reject(err);
                return resolve(docs!);
            } )
        )
    }

    async getById( id: string ): Promise<IPago> {
        return new Promise( (resolve, reject) => Pago
            .findById(id)
            .exec( (err, docs) => {
                if(err) return reject(err);
                return resolve(docs!);
            })
        )
    }

    async addPayment( payment: IPagoAdd ): Promise<IPago[]>{
        return new Promise( (resolve, reject) => Pago
            .insertMany( payment, (err, docs) => {
                if(err) return reject(err);
                return resolve(docs)
            })
        )
    }

    async updatePayment( id: string, payment: IPagoAdd ): Promise<IPago>{
        return new Promise( (resolve, reject) => Pago
            .findByIdAndUpdate( id, payment,
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

export const pagoDAO = new PagoDAO();