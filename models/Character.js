const mongoose = require('mongoose');

const CharacterSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  trait: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  alternative: {
    type: String
  },
  completed: {
    type: Boolean,
    default: false
  },
  progress: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Character = mongoose.model('character', CharacterSchema); 