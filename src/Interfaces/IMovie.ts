export default interface IMovie extends Document {
  name: String,
  releaseDate:Date,
  duration:{
    hours:Number,
    mins:Number,
    secs:Number,
  },
  genre:String,
}