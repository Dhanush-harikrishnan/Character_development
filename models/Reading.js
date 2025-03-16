const mongoose = require('mongoose');

const ReadingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  totalPages: {
    type: Number,
    default: 0
  },
  currentPage: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    default: 'in-progress',
    enum: ['in-progress', 'completed', 'abandoned']
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  completionDate: {
    type: Date
  },
  dailyReadingLogs: [
    {
      date: {
        type: Date,
        default: Date.now
      },
      pagesRead: {
        type: Number,
        required: true
      },
      notes: {
        type: String
      }
    }
  ]
});

module.exports = Reading = mongoose.model('reading', ReadingSchema);