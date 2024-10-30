export default interface IUser extends Document {
  name: string;
  email: string;
  hashedPassword: string;
  createdAt: Date;
}
