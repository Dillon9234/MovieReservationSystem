import mongoose, { Schema, Model } from 'mongoose';
import IMovie from '../Interfaces/IMovie';

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

const Movie: Model<IMovie> = mongoose.model<IMovie>('Movie', movieSchema);

export default Movie;
