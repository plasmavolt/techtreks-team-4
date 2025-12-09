const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Sign up - create a new user
router.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, username, password, name } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    if (username.length < 3) {
      return res.status(400).json({ error: 'Username must be at least 3 characters' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Username validation
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({ error: 'Username can only contain letters, numbers, underscores, and hyphens' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ id: username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    // Create new user
    const user = new User({
      id: username,
      email: email,
      password, // TODO: Hash password before storing in production
      name: name || undefined,
      points: 0,
      questsCompleted: 0
    });

    await user.save();

    // Return user data without password
    const userResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      profilePicture: user.profilePicture,
      points: user.points,
      questsCompleted: user.questsCompleted,
      rank: user.rank
    };

    res.json({
      message: 'User created successfully',
      user: userResponse,
      token: 'mock_token_' + Date.now() // TODO: Generate real JWT token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sign in - authenticate user
router.post('/api/auth/signin', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Find user
    const user = await User.findOne({ id: username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // TODO: Compare hashed password in production
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Return user data without password
    const userResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      profilePicture: user.profilePicture,
      points: user.points,
      questsCompleted: user.questsCompleted,
      rank: user.rank
    };

    res.json({
      message: 'Sign in successful',
      user: userResponse,
      token: 'mock_token_' + Date.now() // TODO: Generate real JWT token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user by username (id)
router.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return user data without password
    const userResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      profilePicture: user.profilePicture,
      points: user.points,
      questsCompleted: user.questsCompleted,
      rank: user.rank
    };

    res.json(userResponse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.put('/api/users/:id', async (req, res) => {
  try {
    const { name, profilePicture } = req.body;

    const user = await User.findOne({ id: req.params.id });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update fields
    if (name !== undefined) user.name = name;
    if (profilePicture !== undefined) user.profilePicture = profilePicture;

    await user.save();

    // Return user data without password
    const userResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      profilePicture: user.profilePicture,
      points: user.points,
      questsCompleted: user.questsCompleted,
      rank: user.rank
    };

    res.json({ message: 'Profile updated successfully', user: userResponse });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;