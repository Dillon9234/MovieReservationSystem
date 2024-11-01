import mongoose, { Schema, Model, Document, Types } from 'mongoose';
import Movie from './Movie'; 
import Seat from './Seat';
import TheaterScreen from './TheaterScreen';
import seatSchema from './Seat';
import ITimeSlot from '../Interfaces/ITimeSlot';


const timeSlotSchema = new Schema<ITimeSlot>({
    date:{type:Date, required:true},
    movie:{type: Schema.Types.ObjectId, ref: Movie, required:true},
    time: {
        hours: { type: Number, required: true, min: 0 },
        mins: { type: Number, required: true, min: 0, max: 59 },
        secs: { type: Number, required: true, min: 0, max: 59 },
      },
    theaterScreen: {type: Schema.Types.ObjectId, ref:TheaterScreen,required:true},
    bookedSeats: [{type: [seatSchema], ref:Seat}]
})

const TimeSlot: Model<ITimeSlot> = mongoose.model<ITimeSlot>('TimeSlot', timeSlotSchema);

export default TimeSlot;
