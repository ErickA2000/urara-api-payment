import { compraDAO } from "@DAO/Compra.dao";
import { MessageProcessor } from "@Interfaces/kafka.interface";
import { Types } from "mongoose";

const updatePurchaseShipping = async ( data: MessageProcessor ): Promise<void> => {
    try {
        
        const updateCompra = await compraDAO.updateBuy( data.idCompra, { idEnvio: Types.ObjectId.createFromHexString(data.idEnvio) } );

        console.log("Actualizacion envio de compra: ", updateCompra);

    } catch (error) {
        console.log("Algo va mal:", error)
    }
}

export default updatePurchaseShipping;