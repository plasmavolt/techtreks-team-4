const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // username
  email: { type: String, required: true, unique: true },
  name: { type: String },
  password: { type: String, required: true },
  profilePicture: { type: String },
  points: { type: Number, default: 0 },
  questsCompleted: { type: Number, default: 0 },
  rank: { type: String },
  friends: [{ type: String }],
  completedChallenges: [{
    challengeId: String,
    locationId: String,
    completedAt: Date,
    pointsEarned: Number
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);