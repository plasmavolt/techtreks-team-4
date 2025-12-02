const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  points: { type: Number, required: true },
  type: {
    type: String,
    enum: ['visit_location', 'visit_category', 'visit_count'],
    required: true
  },
  targetLocationId: String,
  targetCategory: String,
  targetCount: Number,
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Challenge', challengeSchema);