require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://t1allstars.vercel.app',
    process.env.FRONTEND_URL,
  ],
  credentials: true,
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/t1allstars')
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('MongoDB error:', error));

// Routes
app.use('/api/tournaments', require('./routes/tournaments'));
app.use('/api/standings', require('./routes/standings'));
app.use('/api/players', require('./routes/players'));
app.use('/api/results', require('./routes/results'));
app.use('/api/auth', require('./routes/auth'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
