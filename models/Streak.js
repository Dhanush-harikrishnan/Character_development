const mongoose = require('mongoose');

const StreakSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  streakType: {
    type: String,
    required: true
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  targetStreak: {
    type: Number,
    default: 30
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  lastCheckedIn: {
    type: Date,
    default: Date.now
  },
  streakHistory: [
    {
      date: {
        type: Date,
        default: Date.now
      },
      completed: {
        type: Boolean,
        default: true
      },
      notes: {
        type: String
      }
    }
  ],
  active: {
    type: Boolean,
    default: true
  }
});

// Method to check if streak is broken
StreakSchema.methods.isStreakBroken = function() {
  const lastCheckedIn = new Date(this.lastCheckedIn);
  const today = new Date();
  
  // Reset time to beginning of day for comparison
  lastCheckedIn.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  // Calculate difference in days
  const diffTime = Math.abs(today - lastCheckedIn);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // If more than 1 day has passed since last check-in, streak is broken
  return diffDays > 1;
};

module.exports = Streak = mongoose.model('streak', StreakSchema);