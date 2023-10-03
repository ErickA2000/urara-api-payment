import { Iprenda, IprendaDocument } from "@Interfaces/prenda.intrfaces";
import Prenda from "@Models/Prenda";

class PrendaDAO{


    async getOneById( id: string ): Promise<IprendaDocument>{
        return new Promise( (resolve, reject) => Prenda
            .findOne( { _id: id } ).exec( (err, docs) => {
                if(err) return reject(err);
                return resolve(docs!);
            } )
        )
    }

    async updateById( id: string, prenda: Object ): Promise<Iprenda>{
        return new Promise( (resolve, reject) => Prenda
            .findByIdAndUpdate( 
                id, prenda,
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

export const prendaDAO = new PrendaDAO();