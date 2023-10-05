import { Schema, model, PaginateModel, Types } from "mongoose";
import paginate from "mongoose-paginate-v2";
import { Icompra } from "@Interfaces/compra.interfaces";

const tallaCantidadPrecioSchema = new Schema({
    talla: String,
    cantidad: Number,
    precio: Number,
    idColor: {
        ref: "Color",
        type: Schema.Types.ObjectId
    }
},{
    _id: false,
    versionKey: false
})

const direccionFacturacion = new Schema({
    pais: String,
    departamento: String,
    ciudad: String,
    direccion: String,
    especificacionOpcional: String
},{
    _id: false,
    versionKey: false
})

export const productosSchema = new Schema({
    productID: {
        type: Schema.Types.ObjectId
    },
    descuento: Number,
    tallasCantidadPrecio:  tallaCantidadPrecioSchema
},{
    _id: false,
    versionKey: false
});

const phoneSchema = new Schema({
    codigo_area: String,
    numero: String
},
{
    _id: false,
    versionKey: false
});

const compraSchema = new Schema({
    numFactura: String,
    cliente: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    vendedor: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    telefono: phoneSchema,
    productos: [ productosSchema ],
    direccionFacturacion: direccionFacturacion,
    subtotal: Number,
    descuento: Number,
    iva: String,
    iva_moneda: Number,
    total: Number,
    observaciones: String,
    estado: String,
    isCambioEstado: Boolean,
    idPago: Types.ObjectId,
    idEnvio: Types.ObjectId
},{
    timestamps: true
})

compraSchema.plugin(paginate);

export default model<Icompra, PaginateModel<Icompra>>("Compra", compraSchema);