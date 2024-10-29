import mongoose, { Schema, Model, Document, Types } from 'mongoose';

export interface ISeat extends Document {
  row:Number,
  column:Number,
}

const seatSchema = new Schema<ISeat>({
    row: {type:Number, required:true},
    column: {type:Number, required:true},
})

const Seat: Model<ISeat> = mongoose.model<ISeat>('Seat',seatSchema)

export default Seat

