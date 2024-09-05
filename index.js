const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const songRouter = require('./routes/songs'); 

// Middleware
app.use(cors({
  origin: 'https://music-app-front-end-swart.vercel.app/', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));app.use(express.json());

// Routes
app.use('/api/songs', songRouter); 

// Database connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Connection error:', err);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
