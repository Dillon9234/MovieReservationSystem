import ISeat from './ISeat'
import ITheater from './ITheater';

export default interface ITheaterScreen extends Document {
    theater: ITheater,
    Id:Number,
    seating:ISeat[]
}