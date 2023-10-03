import { Icounter } from "@Interfaces/counter.interfaces";
import Counter from "@Models/Counter";

class CounterDAO{

    async getNumPedido( id: string): Promise<Icounter> {
        return new Promise( (resolve, reject) => Counter
            .findOne({ _id: id }).exec( (err, docs) => {
                if(err) return reject(err);
                return resolve(docs!);
            } )
        )
    }

}

export const counterDAO = new CounterDAO();