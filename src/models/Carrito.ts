import { Schema, model, PaginateModel } from "mongoose";
import paginate from "mongoose-paginate-v2";
import { productosSchema } from "./Compra";
import { ICarrito } from "@Interfaces/carrito.interface";


const carritoSchema = new Schema({
    cliente: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    productos: [ productosSchema ]
},{
    timestamps: true
});

carritoSchema.plugin(paginate);

export default model<ICarrito, PaginateModel<ICarrito>>("Carrito", carritoSchema);