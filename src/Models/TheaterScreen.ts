import mongoose, { Schema, Model } from 'mongoose';
import Seat from './Seat';
import {ISeat} from './Seat'
import Theater, {ITheater} from './Theater';

export interface ITheaterScreen extends Document {
    theater: ITheater,
    Id:Number,
    seating:ISeat[]
}

const theaterScreenSchema = new Schema<ITheaterScreen>({
    theater:{ type:Schema.Types.ObjectId, ref: Theater},
    Id: { type: Number, required: true },
    seating: [{ type: Schema.Types.ObjectId, ref: Seat }]
  });

const TheaterScreen: Model<ITheaterScreen> = mongoose.model<ITheaterScreen>('TheaterScreen', theaterScreenSchema);

export default TheaterScreen;
