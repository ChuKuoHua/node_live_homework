import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
  name: string;
  tags: string[];
  type: 'group' | 'person';
  image?: string;
  createAt?: Date;
  content: string;
  likes: number;
  comments: number;
}

const postSchema: Schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '貼文姓名未填寫']
  },
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
  createAt: {
    type: Date,
    default: Date.now,
    select: false
  },
  content: {
    type: String,
    required: [true, 'Content 未填寫']
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