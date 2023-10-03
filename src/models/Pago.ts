import { IPago } from "@Interfaces/pago.interface";
import { Schema, model, PaginateModel, Types } from "mongoose";
import paginate from "mongoose-paginate-v2";

const pagoSchema = new Schema({
    idCliente: Types.ObjectId,
    idServiPago: String,
    servicioPago: String,
    estado: String,
    metodoPago: String,
    fechaPago: Date,
    monto: Number
});

pagoSchema.plugin(paginate);

export default model<IPago, PaginateModel<IPago>>('Pago', pagoSchema);