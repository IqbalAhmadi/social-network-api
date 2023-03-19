const { User, Thought } = require('../models');

// gets all thoughts
const getThoughts = async (req, res) => {
  // console.log('test');
  try {
    const thoughts = await Thought.find({});
    // console.log('thoughts');
    res.json(thoughts);
  } catch (err) {
    res.status(500).json(err);
  }
};

// get single thought
const getSingleThought = async (req, res) => {
  try {
    const foundThought = await Thought.findOne({ _id: req.params.thoughtId });

    res.json(foundThought);
  } catch (err) {
    res.status(500).json(err);
  }
};

// create thought
const createThought = async (req, res) => {
  const { thoughtText, username, userId } = req.body;
  try {
    const newThought = await Thought.create({ thoughtText, username });
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { thoughts: newThought._id } },
      { new: true }
    );

    res.json({ newThought, updatedUser });
  } catch (err) {
    res.status(500).json(err);
  }
};

// update thought
const updateThought = async (req, res) => {
  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $set: { ...req.body } },
      { new: true }
    );

    res.json(updatedThought);
  } catch (err) {
    res.status(500).json(err);
  }
};

// delete thought
const deleteThought = async (req, res) => {
  try {
    const deletedThought = await Thought.deleteOne({
      _id: req.params.thoughtId,
    });

    res.json(deletedThought);
  } catch (err) {
    res.status(500).json(err);
  }
};

// add friend id to thought
const addReaction = async (req, res) => {
  const { thoughtId } = req.params;
  const { reactionBody, username } = req.body;
  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      thoughtId,
      { $addToSet: { reactions: { username, reactionBody } } },
      { new: true }
    );

    res.json(updatedThought);
  } catch (err) {
    res.status(500).json(err);
  }
};

// delete friend id from thought
const deleteReaction = async (req, res) => {
  const { thoughtId } = req.params;
  const { reactionId } = req.body;
  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      thoughtId,
      { $pull: { reactions: { reactionId } } },
      { new: true }
    );

    res.json(updatedThought);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  getThoughts,
  getSingleThought,
  createThought,
  updateThought,
  deleteThought,
  addReaction,
  deleteReaction,
};
