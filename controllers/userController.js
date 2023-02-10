const { User, Thought } = require('../models')

// gets all user
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).exec()

    res.json(users)
  } catch (err) {
    res.status(500).json(err)
  }
}

// get single user
const getSingleUser = async (req, res) => {
  try {
    const foundUser = await User.find({ _id: req.params.userId })
      .populate(['friends', 'thoughts'])
      .exec()

    res.json(foundUser)
  } catch (err) {
    res.status(500).json(err)
  }
}

// create user
const createUser = async (req, res) => {
  const { username, email } = req.body

  try {
    const newUser = await User.create({ username, email })

    res.json(newUser)
  } catch (err) {
    res.status(500).json(err)
  }
}

// update user
const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: { ...req.body } },
      { new: true }
    )

    updatedUser ? res.json(updatedUser) : res.json({ message: 'No user found' })
  } catch (err) {
    res.status(500).json(err)
  }
}

// delete user
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.userId).exec()

    if (deletedUser) {
      await Thought.deleteMany({ username: deletedUser.username })

      res.json(deletedUser)
    } else res.json({ message: 'No user deleted' })
  } catch (err) {
    res.status(500).json(err)
  }
}

// add friend id to user
const addFriend = async (req, res) => {
  const { userId, friendId } = req.params
  try {
    const results = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { friends: friendId } },
      { new: true }
    ).exec()

    results ? res.json(results) : res.json({ message: 'No user found' })
  } catch (err) {
    res.status(500).json(err)
  }
}

// delete friend id from user
const deleteFriend = async (req, res) => {
  const { userId, friendId } = req.params
  try {
    const results = await User.findByIdAndUpdate(
      userId,
      { $pull: { friends: friendId } },
      { new: true }
    ).exec()

    res.json(results)
  } catch (err) {
    res.status(500).json(err)
  }
}

module.exports = {
  getUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  deleteFriend,
}
