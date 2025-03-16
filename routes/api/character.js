const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Character = require('../../models/Character');
const User = require('../../models/User');

// @route   GET api/character
// @desc    Get all character traits for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const characters = await Character.find({ user: req.user.id }).sort({ date: -1 });
    res.json(characters);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/character
// @desc    Create a character trait
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('trait', 'Trait is required').not().isEmpty(),
      check('alternative', 'Alternative behavior is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { trait, description, alternative } = req.body;

      const newCharacter = new Character({
        user: req.user.id,
        trait,
        description,
        alternative
      });

      const character = await newCharacter.save();

      res.json(character);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/character/:id
// @desc    Get character trait by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const character = await Character.findById(req.params.id);

    if (!character) {
      return res.status(404).json({ msg: 'Character trait not found' });
    }

    // Check if character belongs to user
    if (character.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    res.json(character);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Character trait not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/character/:id
// @desc    Update character trait
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const character = await Character.findById(req.params.id);

    if (!character) {
      return res.status(404).json({ msg: 'Character trait not found' });
    }

    // Check if character belongs to user
    if (character.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    const { trait, description, alternative, completed, progress } = req.body;

    // Update fields if they exist in the request
    if (trait) character.trait = trait;
    if (description) character.description = description;
    if (alternative) character.alternative = alternative;
    if (completed !== undefined) character.completed = completed;
    if (progress !== undefined) character.progress = progress;

    await character.save();

    res.json(character);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Character trait not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/character/:id
// @desc    Delete character trait
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const character = await Character.findById(req.params.id);

    if (!character) {
      return res.status(404).json({ msg: 'Character trait not found' });
    }

    // Check if character belongs to user
    if (character.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await character.remove();

    res.json({ msg: 'Character trait removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Character trait not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router; 