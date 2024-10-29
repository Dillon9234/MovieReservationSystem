import mongoose, { Schema, Model, Document, Types } from 'mongoose';
import Movie, { IMovie } from './Movie'; 

export interface ITimeSlot extends Document {
  movie: Types.ObjectId | IMovie; 
  time:{
    hours:Number,
    mins:Number,
    secs:Number,
  },
}

const timeSlotSchema = new Schema<ITimeSlot>({
    movie:{type: Schema.Types.ObjectId, ref: Movie, required:true},
    time: {
        hours: { type: Number, required: true, min: 0 },
        mins: { type: Number, required: true, min: 0, max: 59 },
        secs: { type: Number, required: true, min: 0, max: 59 },
      },
})

const TimeSlot: Model<ITimeSlot> = mongoose.model<ITimeSlot>('TimeSlot', timeSlotSchema);

export default TimeSlot;
