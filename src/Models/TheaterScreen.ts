import mongoose, { Schema, Model } from 'mongoose';
import Theater from './Theater';
import ITheaterScreen from '../Interfaces/ITheaterScreen';
import seatSchema from './Seat';

const theaterScreenSchema = new Schema<ITheaterScreen>({
    theater:{ type:Schema.Types.ObjectId, ref: Theater},
    Id: { type: Number, required: true ,unique: true},
    seating: { type: [seatSchema]},
  });

const TheaterScreen: Model<ITheaterScreen> = mongoose.model<ITheaterScreen>('TheaterScreen', theaterScreenSchema);

export default TheaterScreen;

