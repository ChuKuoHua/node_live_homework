const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  username: {
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
  role:{
    type: String,
    default: "user",
    enum:["user","host"]
  },
  password:{
    type: String,
    required: [true,'請輸入密碼'],
    minlength: 8,
    select: false
  },
  status: {     
    type: String,
    default: 0,
    enum:["0","1"]
  },
  gender: {
    type: String,
    default: 'male',
    enum: ['male', 'female'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
    select: false
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    select: false
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;