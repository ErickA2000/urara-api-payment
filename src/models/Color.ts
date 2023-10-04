import { Schema, model, PaginateModel } from "mongoose";
import paginate from "mongoose-paginate-v2";
import { IcolorDocument } from "@Interfaces/color.interfaces";

const colorSchema = new Schema({
    nombre: String,
    hex: String
},{
    timestamps: true
});

colorSchema.plugin(paginate);

export default model<IcolorDocument, PaginateModel<IcolorDocument>>('Color', colorSchema);