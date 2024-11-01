import IMovie from './IMovie'; 
import ISeat from './ISeat';
import ITheaterScreen from './ITheaterScreen';

export default interface ITimeSlot extends Document {
  date:Date,
  movie: IMovie; 
  time:{
    hours:Number,
    mins:Number,
    secs:Number,
  },
  theaterScreen: ITheaterScreen,
  bookedSeats: ISeat[],
}