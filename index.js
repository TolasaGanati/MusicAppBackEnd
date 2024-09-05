const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;
const songRouter = require('./routes/songs'); 

// Middleware
app.use(cors({
  origin: 'https://music-app-front-end-swart.vercel.app/', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());

// Routes
app.use('/api/songs', songRouter); 

// Root route to handle GET requests to '/'
app.get('/', (req, res) => {
  res.send('Welcome to the Music App Backend!');
});

// Database connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Connection error:', err);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
