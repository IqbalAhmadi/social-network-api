const { Schema, model } = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: 'Username is required',
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: 'Email address is required',
      lowercase: true,
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please fill a valid email address',
      ],
    },
    thoughts: [{ type: Schema.Types.ObjectId, ref: 'thought' }],
    friends: [{ type: Schema.Types.ObjectId, ref: 'user' }],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
)

userSchema.plugin(uniqueValidator)
userSchema.virtual('friendCount').get(function () {
  return this.friends.length
})

const User = model('user', userSchema)

module.exports = User
