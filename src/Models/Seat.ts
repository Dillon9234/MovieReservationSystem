import { Schema } from "mongoose";
import ISeat from "../Interfaces/ISeat";

const seatSchema = new Schema<ISeat>({
    row: { type: Number, required: true },
    column: { type: Number, required: true }
});

export default seatSchema