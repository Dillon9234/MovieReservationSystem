import ITimeSlot from './ITimeSlot'; 

export default interface IDay extends Document {
    date:Date,
    slots: ITimeSlot[],
}