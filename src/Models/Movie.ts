import mongoose, { Schema, Model } from 'mongoose';

export interface IMovie extends Document {
  name: String,
  releaseDate:Date,
  duration:{
    hours:Number,
    mins:Number,
    secs:Number,
  },
  genre:String,
}

const movieSchema = new Schema<IMovie>({
    name: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    duration: {
      hours: { type: Number, required: true, min: 0 },
      mins: { type: Number, required: true, min: 0, max: 59 },
      secs: { type: Number, required: true, min: 0, max: 59 },
    },
    genre: { type: String, required: true },
  });

// 3. Create a Model
const Movie: Model<IMovie> = mongoose.model<IMovie>('Movie', movieSchema);

export default Movie;
