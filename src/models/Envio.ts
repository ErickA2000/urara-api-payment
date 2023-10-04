import { Ienvio } from "@Interfaces/envio.interface";
import { Schema, model, PaginateModel, Types } from "mongoose";
import paginate from "mongoose-paginate-v2";

const envioSchema = new Schema({
    idCliente: Types.ObjectId,
    tokenServiEnvio: String,
    estado: String,
    paqueteria: String,
    fechaEnvio: Date,
    fechaEntrega: Date,
    montoEnvio: Number
});

envioSchema.plugin(paginate);

export default model<Ienvio, PaginateModel<Ienvio>>('Envio', envioSchema);