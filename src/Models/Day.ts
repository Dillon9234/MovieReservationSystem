import mongoose, { Schema, Model, Document, Types } from 'mongoose';
import TimeSlot, { ITimeSlot } from './TimeSlot'; 

export interface IDay extends Document {
  date:Date,
  slots: Types.ObjectId[],
}

const daySchema = new Schema<IDay>({
    date: {type:Date, required:true},
    slots:[{type: Schema.Types.ObjectId, ref:TimeSlot}],
})

const Day: Model<IDay> = mongoose.model<IDay>('Day',daySchema)

export default Day

