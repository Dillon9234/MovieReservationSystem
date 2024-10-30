import mongoose, { Schema, Model} from 'mongoose';
import IDay from '../Interfaces/IDay';
import TimeSlot from './TimeSlot';

const daySchema = new Schema<IDay>({
    date: {type:Date, required:true},
    slots:[{type: Schema.Types.ObjectId, ref:TimeSlot}],
})

const Day: Model<IDay> = mongoose.model<IDay>('Day',daySchema)

export default Day

