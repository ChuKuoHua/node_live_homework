import mongoose, {Schema} from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
}

const userSchema: Schema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, '請輸入您的名字']
    },
    email: {
      type: String,
      required: [true, '請輸入您的 Email'],
      unique: true,
      lowercase: true,
      select: false
    },
    photo: String,
  });

const User = mongoose.model<IUser>('User', userSchema);

module.exports = User;