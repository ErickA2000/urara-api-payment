import { compraDAO } from "@DAO/Compra.dao";
import { MessageProcessor } from "@Interfaces/kafka.interface";
import { Types } from "mongoose";

const updatePurchaseShipping = async ( data: MessageProcessor ): Promise<void> => {
    try {
        const idEnvio = new Types.ObjectId(data.idEnvio);
        
        await compraDAO.updateBuy( data.idCompra, { idEnvio } );

    } catch (error) {
        console.log("Algo va mal:", error)
    }
}

export default updatePurchaseShipping;