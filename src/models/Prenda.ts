import mongoose, { Schema, model } from 'mongoose'
import paginate from 'mongoose-paginate-v2';
import { IprendaDocument } from '@Interfaces/prenda.intrfaces';

const color = new Schema({
    idColor: {
        ref: "Color",
        type: Schema.Types.ObjectId
    },
    cantidad: Number
},{
    _id: false,
    versionKey: false
});

const tallaCantidadPrecioSchema = new Schema({
    talla: {
        ref: "Talla",
        type: String
    },
    cantidad: Number,
    precio: Number,
    colores: [ color ]
},{
    _id: false,
    versionKey: false
});

const prendaSchema = new Schema({
    nombre: String,
    referencia: {
        type: String,
        unique: true
    },
    slug: String,
    imagenUrl: {
        type: Schema.Types.Array
    },
    descripcion: String,
    tallasCantidadPrecio: [tallaCantidadPrecioSchema],
    descuento: Number,
    estado: String,
    categoria: [{
        ref: "Categorias",
        type: Schema.Types.ObjectId
    }] 
},{
    timestamps: true,
    versionKey: false
})

prendaSchema.plugin(paginate);

export default model<IprendaDocument, mongoose.PaginateModel<IprendaDocument>>('Prenda', prendaSchema);