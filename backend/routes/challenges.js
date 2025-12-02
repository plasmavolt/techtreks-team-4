const express = require('express');
const router = express.Router();
const Challenge = require('../models/Challenge');
const User = require('../models/User');

// Get all active challenges
router.get('/api/challenges', async (req, res) => {
  try {
    const challenges = await Challenge.find({ isActive: true });
    res.json({
      count: challenges.length,
      data: challenges
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a challenge (for testing)
router.post('/api/challenges/create', async (req, res) => {
  try {
    const challenge = new Challenge(req.body);
    await challenge.save();
    res.json({ message: 'Challenge created!', challenge });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Complete a challenge
router.post('/api/challenges/complete', async (req, res) => {
  try {
    const { username, challengeId, locationId } = req.body;
    
    // Find user and challenge
    const user = await User.findOne({ username });
    const challenge = await Challenge.findById(challengeId);
    
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!challenge) return res.status(404).json({ error: 'Challenge not found' });
    
    // Check if already completed
    const alreadyCompleted = user.completedChallenges.some(
      c => c.challengeId === challengeId
    );
    
    if (alreadyCompleted) {
      return res.status(400).json({ error: 'Challenge already completed!' });
    }
    
    // Award points
    user.points += challenge.points;
    user.completedChallenges.push({
      challengeId,
      locationId,
      completedAt: new Date(),
      pointsEarned: challenge.points
    });
    
    await user.save();
    
    res.json({
      message: 'Challenge completed!',
      pointsEarned: challenge.points,
      totalPoints: user.points,
      user
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;