# Tyler1 All Stars Backend API

A Node.js + Express backend API for managing Tyler1 All Stars tournament data.

## Features

- 🎮 Tournament management (create, read, update, delete)
- 🏆 Leaderboard standings
- 👥 Player management
- 🎯 Tournament results tracking
- 🔐 Admin authentication with JWT
- 📱 RESTful API
- 🌐 CORS enabled for frontend integration

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + bcrypt
- **Environment**: dotenv

## Installation

1. Clone the repository:
```bash
git clone https://github.com/isiezb/t1allstarsbackend.git
cd t1allstarsbackend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from template:
```bash
cp .env.example .env
```

4. Update `.env` with your MongoDB URI and other config:
```
MONGODB_URI=mongodb://localhost:27017/t1allstars
JWT_SECRET=your_secret_key
PORT=5000
FRONTEND_URL=http://localhost:3000
```

## Running the Server

Development (with auto-reload):
```bash
npm run dev
```

Production:
```bash
npm start
```

Server will run on http://localhost:5000

## API Endpoints

### Tournaments
- `GET /api/tournaments` - Get all tournaments
- `GET /api/tournaments/:week` - Get tournament by week
- `POST /api/tournaments` - Create tournament (admin only)
- `PUT /api/tournaments/:id` - Update tournament (admin only)
- `DELETE /api/tournaments/:id` - Delete tournament (admin only)

### Standings
- `GET /api/standings` - Get all standings
- `POST /api/standings` - Create standing (admin only)
- `PUT /api/standings/:id` - Update standing (admin only)
- `DELETE /api/standings/:id` - Delete standing (admin only)

### Players
- `GET /api/players` - Get all players
- `GET /api/players/:name` - Get player by name
- `POST /api/players` - Create player (admin only)
- `PUT /api/players/:id` - Update player (admin only)
- `DELETE /api/players/:id` - Delete player (admin only)

### Results
- `GET /api/results` - Get latest results
- `POST /api/results` - Create result (admin only)
- `PUT /api/results/:id` - Update result (admin only)
- `DELETE /api/results/:id` - Delete result (admin only)

### Authentication
- `POST /api/auth/register` - Register new admin
- `POST /api/auth/login` - Login admin
- `GET /api/auth/me` - Get current admin (requires token)

## Authentication

Protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Example Requests

### Register Admin
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","email":"admin@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```

### Create Tournament
```bash
curl -X POST http://localhost:5000/api/tournaments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"week":1,"date":"Jan 27","region":"NA","status":"upcoming","participants":["player1","player2"]}'
```

## Database Schema

### Tournament
- week: Number (unique)
- date: String
- region: String (NA, EU, KR)
- status: String (complete, live, upcoming)
- participants: Array of Strings

### Standing
- rank: Number (unique)
- name: String
- region: String
- points: Number
- tournaments: Number
- wins: Number
- prize: Number

### Player
- name: String (unique)
- region: String
- title: String
- image: String (URL)
- description: String

### Result
- tournament: String
- date: String
- winner: String
- runner_up: String
- region: String
- prize_pool: Number

## Deployment

### Heroku
```bash
git push heroku main
```

### Railway / Render / Fly.io
Follow their deployment docs and set environment variables.

## License

ISC
