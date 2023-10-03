import { Schema, model } from "mongoose";
import { Icounter } from "@Interfaces/counter.interfaces";

const counterSchema = new Schema({
    _id: String,
    seq_value: Number
},{
    versionKey: false
});

export default model<Icounter>("Counter", counterSchema);

