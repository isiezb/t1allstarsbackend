require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://t1allstars.com',
    'https://www.t1allstars.com',
    'https://t1allstars.vercel.app',
    'https://t1allstars.onrender.com',
    'https://t1allstars-frontend.onrender.com',
    /\.onrender\.com$/,  // Allow all Render domains
    process.env.FRONTEND_URL,
  ],
  credentials: true,
}));
app.use(express.json());

// Supabase is connected via environment variables
console.log('Supabase connected:', process.env.SUPABASE_URL ? 'Yes' : 'No');

// Routes
app.use('/api/tournaments', require('./routes/tournaments'));
app.use('/api/standings', require('./routes/standings'));
app.use('/api/players', require('./routes/players'));
app.use('/api/results', require('./routes/results'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/rules', require('./routes/rules'));
app.use('/api/vods', require('./routes/vods'));
app.use('/api/application-url', require('./routes/application'));

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
  console.log('Supabase API connected to:', process.env.SUPABASE_URL);
});
