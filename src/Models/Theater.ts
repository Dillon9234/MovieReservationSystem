import mongoose, { Schema, Model } from 'mongoose';

export interface ITheater extends Document {
  Id:Number,
  name:String
}

const TheaterSchema = new Schema<ITheater>({
    Id: { type: Number, required: true, unique: true },
    name:{type:String, required:true}
  });

const Theater: Model<ITheater> = mongoose.model<ITheater>('Theater', TheaterSchema);

export default Theater;
