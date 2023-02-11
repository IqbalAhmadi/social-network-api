const connection = require('../config/connection')
const { Thought, User } = require('../models')
const { userData, thoughtData, reactionData } = require('./data')

connection.on('error', (err) => err)

connection.once('open', async () => {
  let promises = []
  console.log('connected')

  await Thought.deleteMany({})
  await User.deleteMany({})

  const users = await User.create(userData)
  const thoughts = await Thought.create(thoughtData)

  const userIds = users.map((obj) => {
    return obj._id.toString()
  })
  const thoughtIds = thoughts.map((obj) => {
    return obj._id.toString()
  })

  userIds.forEach((id, i) => {
    const friendPromise = User.updateMany(
      { _id: { $ne: id } },
      { $addToSet: { friends: id } }
    )
    const thoughtPromise = User.findOneAndUpdate(
      { _id: id },
      { $addToSet: { thoughts: thoughtIds[i] } }
    )
    const reactionPromise = Thought.findByIdAndUpdate(
      thoughtIds[i],
      { $addToSet: { reactions: reactionData[i] } },
      { new: true }
    )
    promises.push(friendPromise, thoughtPromise, reactionPromise)
  })

  await Promise.all(promises)
  console.info('Seeding complete! 🌱')
  process.exit(0)
})
