// Question Document Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  title: {
    type: String,
    required: true,
    maxLength: 50,
  },
  summary: {
    type: String,
    required: true,
    maxlength: 140,
  },
  text: {
    type: String,
    required: true,
  },
  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tag'
    }
  ],
  answers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Answer'
    }
  ],
  comments: [{
    text: String,
    comment_date: { type: Date, default: Date.now },
    comment_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  votes: [{ vote_up: Boolean, vote_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }],
  asked_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  asked_date_time: {
    type: Date,
    required: true,
    default: Date.now
  },
  views: {
    type: Number,
    required: true,
    default: 0
  }
});

module.exports = mongoose.model('Question', QuestionSchema);
