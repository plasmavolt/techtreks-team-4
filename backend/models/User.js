const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  points: { type: Number, default: 0 },
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