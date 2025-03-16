const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Streak = require('../../models/Streak');
const User = require('../../models/User');

// @route   GET api/streaks
// @desc    Get all streaks for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const streaks = await Streak.find({ user: req.user.id }).sort({ streakType: 1 });
    res.json(streaks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/streaks
// @desc    Create a new streak
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('streakType', 'Streak type is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { streakType, targetStreak, notes } = req.body;

      // Check if streak already exists for this user and type
      let streak = await Streak.findOne({ user: req.user.id, streakType });

      if (streak) {
        return res.status(400).json({ msg: 'Streak already exists for this type' });
      }

      // Create new streak
      streak = new Streak({
        user: req.user.id,
        streakType,
        targetStreak: targetStreak || 30
      });

      // Add initial note if provided
      if (notes) {
        streak.streakHistory.unshift({
          date: Date.now(),
          completed: true,
          notes
        });
      }

      await streak.save();

      res.json(streak);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/streaks/:id
// @desc    Update a streak with check-in data
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const streak = await Streak.findById(req.params.id);

    if (!streak) {
      return res.status(404).json({ msg: 'Streak not found' });
    }

    // Check if streak belongs to user
    if (streak.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    const { streakHistory } = req.body;
    
    if (streakHistory) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Check if already checked in today
      const todayEntry = streak.streakHistory.find(entry => {
        const entryDate = new Date(entry.date);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === today.getTime();
      });
      
      if (todayEntry) {
        // Update today's entry
        todayEntry.completed = streakHistory.completed;
        todayEntry.notes = streakHistory.notes;
      } else {
        // Add new entry
        streak.streakHistory.unshift({
          date: streakHistory.date || Date.now(),
          completed: streakHistory.completed,
          notes: streakHistory.notes
        });
        
        // Check if streak is broken
        if (streak.isStreakBroken()) {
          // If today's entry is completed, set streak to 1, otherwise 0
          streak.currentStreak = streakHistory.completed ? 1 : 0;
        } else {
          // If today's entry is completed, increment streak, otherwise reset to 0
          streak.currentStreak = streakHistory.completed ? streak.currentStreak + 1 : 0;
        }
        
        // Update longest streak if needed
        if (streak.currentStreak > streak.longestStreak) {
          streak.longestStreak = streak.currentStreak;
        }
        
        // Update last checked in date
        streak.lastCheckedIn = Date.now();
      }
    }
    
    await streak.save();
    res.json(streak);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/streaks/checkin/:id
// @desc    Check in for a streak
// @access  Private
router.put('/checkin/:id', auth, async (req, res) => {
  try {
    const streak = await Streak.findById(req.params.id);

    if (!streak) {
      return res.status(404).json({ msg: 'Streak not found' });
    }

    // Check if streak belongs to user
    if (streak.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    const { notes } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already checked in today
    const lastCheckedIn = new Date(streak.lastCheckedIn);
    lastCheckedIn.setHours(0, 0, 0, 0);

    if (lastCheckedIn.getTime() === today.getTime()) {
      return res.status(400).json({ msg: 'Already checked in today' });
    }

    // Check if streak is broken
    if (streak.isStreakBroken()) {
      // Reset streak
      streak.currentStreak = 1;
    } else {
      // Increment streak
      streak.currentStreak += 1;
    }

    // Update longest streak if needed
    if (streak.currentStreak > streak.longestStreak) {
      streak.longestStreak = streak.currentStreak;
    }

    // Add to streak history
    streak.streakHistory.unshift({
      date: Date.now(),
      completed: true,
      notes
    });

    // Update last checked in date
    streak.lastCheckedIn = Date.now();

    await streak.save();

    res.json(streak);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/streaks/reset/:id
// @desc    Reset a streak (for when user breaks the streak)
// @access  Private
router.put('/reset/:id', auth, async (req, res) => {
  try {
    const streak = await Streak.findById(req.params.id);

    if (!streak) {
      return res.status(404).json({ msg: 'Streak not found' });
    }

    // Check if streak belongs to user
    if (streak.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    const { notes } = req.body;

    // Reset current streak
    streak.currentStreak = 0;

    // Add to streak history
    streak.streakHistory.unshift({
      date: Date.now(),
      completed: false,
      notes
    });

    // Update last checked in date
    streak.lastCheckedIn = Date.now();

    await streak.save();

    res.json(streak);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/streaks/:id
// @desc    Get streak by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const streak = await Streak.findById(req.params.id);

    if (!streak) {
      return res.status(404).json({ msg: 'Streak not found' });
    }

    // Check if streak belongs to user
    if (streak.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    res.json(streak);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Streak not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/streaks/:id
// @desc    Delete a streak
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const streak = await Streak.findById(req.params.id);

    if (!streak) {
      return res.status(404).json({ msg: 'Streak not found' });
    }

    // Check if streak belongs to user
    if (streak.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await Streak.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Streak removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Streak not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;