const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Add a friend
router.post('/api/friends/add', async (req, res) => {
  try {
    const { username, friendUsername } = req.body;
    
    const user = await User.findOne({ username });
    const friend = await User.findOne({ username: friendUsername });
    
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!friend) return res.status(404).json({ error: 'Friend not found' });
    
    // Check if already friends
    if (user.friends.includes(friendUsername)) {
      return res.status(400).json({ error: 'Already friends!' });
    }
    
    user.friends.push(friendUsername);
    await user.save();
    
    res.json({
      message: `Added ${friendUsername} as friend!`,
      friends: user.friends
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get friend activity
router.get('/api/users/:username/friends/activity', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    // Get all friends
    const friends = await User.find({ username: { $in: user.friends } })
      .select('username completedChallenges points');
    
    res.json({
      count: friends.length,
      data: friends
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get leaderboard
router.get('/api/leaderboard', async (req, res) => {
  try {
    const topUsers = await User.find()
      .sort({ points: -1 })  // Sort by points descending
      .limit(10)              // Top 10 only
      .select('username points completedChallenges'); // Only return these fields
    
    res.json({
      count: topUsers.length,
      data: topUsers
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;