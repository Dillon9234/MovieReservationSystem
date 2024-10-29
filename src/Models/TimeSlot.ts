import mongoose, { Schema, Model, Document, Types } from 'mongoose';
import Movie, { IMovie } from './Movie'; 
import Seat, { ISeat } from './Seat';
import TheaterScreen, { ITheaterScreen } from './TheaterScreen';

export interface ITimeSlot extends Document {
  movie: IMovie; 
  time:{
    hours:Number,
    mins:Number,
    secs:Number,
  },
  theaterScreen: ITheaterScreen,
  bookedSeats: ISeat[],

}

const timeSlotSchema = new Schema<ITimeSlot>({
    movie:{type: Schema.Types.ObjectId, ref: Movie, required:true},
    time: {
        hours: { type: Number, required: true, min: 0 },
        mins: { type: Number, required: true, min: 0, max: 59 },
        secs: { type: Number, required: true, min: 0, max: 59 },
      },
    theaterScreen: {type: Schema.Types.ObjectId, ref:TheaterScreen,required:true},
    bookedSeats: [{type: Schema.Types.ObjectId, ref:Seat}]
})

const TimeSlot: Model<ITimeSlot> = mongoose.model<ITimeSlot>('TimeSlot', timeSlotSchema);

export default TimeSlot;
