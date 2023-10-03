import User from '@Models/Usuario';
import { IUser } from "@Interfaces/usuario.interface";

class UsuarioDAO{

    async getOneById( id: string ): Promise<IUser>{
        return new Promise( (resolve, reject) => User
            .findById( id )
            .populate("roles")
            .exec( (err, docs) => {
                if(err) return reject(err);
                return resolve(docs!);
            })
        )
    }

}

export const usuarioDao = new UsuarioDAO();