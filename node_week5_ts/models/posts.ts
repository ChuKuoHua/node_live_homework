import mongoose, {Schema} from 'mongoose';

export interface IPost extends Document {
  tags: string;
  type: string;
  image?: string;
  createdAt: Date;
  content: string;
  user: string;
  likes?: number;
  comments?: number;
}

const postSchema: Schema = new mongoose.Schema({
  tags: [
    {
      type: String,
      required: [true, '貼文標籤 tags 未填寫']
    }
  ],
  type: {
    type: String,
    enum: ['group', 'person'],
    required: [true, '貼文類型 type 未填寫']
  },
  image: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now,
    select: false
  },
  content: {
    type: String,
    required: [true, 'Content 未填寫']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'ID 未填寫']
  },
  likes: {
    type: Number,
    default: 0
  },
  comments: {
    type: Number,
    default: 0
  }
});

const posts = mongoose.model<IPost>('posts', postSchema)

export default posts;