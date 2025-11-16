require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.send("Hello from SideQuest backend!")
});

app.get('/yelp-test', async (req, res) => {
    try {
      const response = await axios.get('https://api.yelp.com/v3/businesses/search', {
        headers: {
          'Authorization': `Bearer ${process.env.YELP_API_KEY}`
        },
        params: {
          location: 'New York',
          term: 'restaurants',
          limit: 5
        }
      });
      
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});