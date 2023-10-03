import { Document } from "mongoose";

export interface Icounter extends Document{
    _id: string,
    seq_value: number
}