const express = require('express');
const router = express.Router();
const User = require('../models/User');
// Create a new user (for testing - no auth)
router.post('/api/users/create', async (req, res) => {
  try {
    const { username, email } = req.body;
    
    const user = new User({
      username,
      email,
      points: 0
    });
    
    await user.save();
    res.json({ message: 'User created!', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user by username
router.get('/api/users/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;