// Answer Document Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnswerSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  ans_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  ans_date_time: {
    type: Date,
    required: true,
    default: Date.now
  },
  comments: [{
    text: String,
    comment_date: { type: Date, default: Date.now },
    comment_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  votes: [{ vote_up: Boolean, vote_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }]
});

module.exports = mongoose.model('Answer', AnswerSchema);

