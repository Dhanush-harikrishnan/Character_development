const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Reading = require('../../models/Reading');
const User = require('../../models/User');

// @route   GET api/reading
// @desc    Get all reading entries for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const readings = await Reading.find({ user: req.user.id }).sort({ startDate: -1 });
    res.json(readings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/reading
// @desc    Create a reading entry
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('author', 'Author is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, author, totalPages } = req.body;

      const newReading = new Reading({
        user: req.user.id,
        title,
        author,
        totalPages: totalPages || 0
      });

      const reading = await newReading.save();

      res.json(reading);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/reading/log/:id
// @desc    Add a daily reading log
// @access  Private
router.put(
  '/log/:id',
  [
    auth,
    [
      check('pagesRead', 'Pages read is required').isNumeric()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const reading = await Reading.findById(req.params.id);

      // Check if reading exists
      if (!reading) {
        return res.status(404).json({ msg: 'Reading entry not found' });
      }

      // Check if reading belongs to user
      if (reading.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'User not authorized' });
      }

      const { pagesRead, notes } = req.body;

      // Add to daily reading logs
      reading.dailyReadingLogs.unshift({
        date: Date.now(),
        pagesRead,
        notes
      });

      // Update current page
      reading.currentPage += parseInt(pagesRead);

      // Check if book is completed
      if (reading.totalPages > 0 && reading.currentPage >= reading.totalPages) {
        reading.status = 'completed';
        reading.completionDate = Date.now();
      }

      await reading.save();

      res.json(reading);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/reading/:id
// @desc    Get reading by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const reading = await Reading.findById(req.params.id);

    if (!reading) {
      return res.status(404).json({ msg: 'Reading entry not found' });
    }

    // Check if reading belongs to user
    if (reading.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    res.json(reading);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Reading entry not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/reading/:id
// @desc    Update reading status
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const reading = await Reading.findById(req.params.id);

    if (!reading) {
      return res.status(404).json({ msg: 'Reading entry not found' });
    }

    // Check if reading belongs to user
    if (reading.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Update fields
    const { title, author, totalPages, status, currentPage } = req.body;

    if (title) reading.title = title;
    if (author) reading.author = author;
    if (totalPages) reading.totalPages = totalPages;
    if (status) reading.status = status;
    if (currentPage) reading.currentPage = currentPage;

    // If status is completed, set completion date
    if (status === 'completed' && reading.status !== 'completed') {
      reading.completionDate = Date.now();
    }

    await reading.save();
    res.json(reading);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Reading entry not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/reading/:id
// @desc    Delete reading entry
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const reading = await Reading.findById(req.params.id);

    if (!reading) {
      return res.status(404).json({ msg: 'Reading entry not found' });
    }

    // Check if reading belongs to user
    if (reading.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await Reading.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Reading entry removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Reading entry not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;