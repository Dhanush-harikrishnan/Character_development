const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const config = require('config');
const dotenv = require('dotenv');

// Load env variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());

// DB Config
const db = process.env.MONGO_URI || config.get('mongoURI');

// Connect to MongoDB
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/streaks', require('./routes/api/streaks'));
app.use('/api/reading', require('./routes/api/reading'));
app.use('/api/character', require('./routes/api/character'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));