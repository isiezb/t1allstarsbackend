# Database Seed Scripts Guide

## 🌱 Overview

These scripts help you quickly populate your Supabase database with sample tournament data, making it easy to test and develop your Tyler1 All Stars website.

## 📋 Prerequisites

Before running the seed scripts, ensure:

1. **Supabase Database Tables Exist**

   Your Supabase database must have these tables:

   ```sql
   -- Admins table
   CREATE TABLE admins (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     username TEXT UNIQUE NOT NULL,
     password TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Players table
   CREATE TABLE players (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     name TEXT UNIQUE NOT NULL,
     region TEXT NOT NULL CHECK (region IN ('NA', 'EU', 'KR')),
     title TEXT,
     image TEXT,
     description TEXT,
     twitch TEXT,
     champions TEXT[],
     record TEXT,
     points INTEGER DEFAULT 0,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Tournaments table
   CREATE TABLE tournaments (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     week INTEGER UNIQUE NOT NULL,
     date TEXT NOT NULL,
     region TEXT NOT NULL CHECK (region IN ('NA', 'EU', 'KR')),
     status TEXT NOT NULL CHECK (status IN ('complete', 'live', 'upcoming')),
     participants TEXT[] DEFAULT '{}',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Standings table
   CREATE TABLE standings (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     rank INTEGER UNIQUE NOT NULL,
     name TEXT NOT NULL,
     region TEXT NOT NULL CHECK (region IN ('NA', 'EU', 'KR')),
     points INTEGER DEFAULT 0,
     tournaments INTEGER DEFAULT 0,
     wins INTEGER DEFAULT 0,
     prize INTEGER DEFAULT 0,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Results table
   CREATE TABLE results (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     tournament TEXT NOT NULL,
     date TEXT NOT NULL,
     winner TEXT NOT NULL,
     runner_up TEXT NOT NULL,
     region TEXT NOT NULL CHECK (region IN ('NA', 'EU', 'KR')),
     prize_pool INTEGER DEFAULT 0,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

2. **Environment Variables Set**

   Make sure your `.env` file contains:
   ```
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_SERVICE_KEY=your_supabase_service_role_key
   ```

## 🚀 Running the Scripts

### Seed the Database

Populate the database with sample data:

```bash
npm run seed
```

This will create:
- **1 Admin User**
  - Username: `admin`
  - Password: `admin123`
  - ⚠️ CHANGE THIS PASSWORD AFTER FIRST LOGIN!

- **8 Players**
  - Humzh, AloisNL, Drututt, TFBlade, Nemesis, Solarbacca, Agurin, Adrian
  - Each with region, Twitch username, champions, and stats

- **6 Tournaments**
  - Weeks 1-6 with rotating regions (NA, EU, KR)
  - Week 1-2: Complete
  - Week 3-6: Upcoming

- **8 Standings Entries**
  - Current season rankings with points, tournaments played, wins, and prizes

- **2 Results**
  - Week 1 NA: Humzh defeats TFBlade
  - Week 2 EU: AloisNL defeats Drututt

### Clear the Database

Remove all data from the database:

```bash
npm run clear
```

⚠️ **Warning**: This will delete ALL data from:
- admins
- players
- tournaments
- standings
- results

### Reset the Database

Clear and then seed in one command:

```bash
npm run reset
```

This is equivalent to running `npm run clear` followed by `npm run seed`.

## 📊 Sample Data Details

### Admin User
- **Username**: admin
- **Password**: admin123
- **Important**: Change this password immediately after first login!

### Players (8 total)
1. **Humzh** (NA) - Top Lane Specialist, 350 points
2. **AloisNL** (EU) - Darius One-Trick, 300 points
3. **Drututt** (EU) - Camille Master, 250 points
4. **TFBlade** (NA) - Challenger Top, 220 points
5. **Nemesis** (EU) - Ex-Fnatic Mid, 200 points
6. **Solarbacca** (NA) - Tank Specialist, 180 points
7. **Agurin** (EU) - Jungle Main, 150 points
8. **Adrian** (NA) - Riven God, 120 points

### Tournaments (6 weeks)
- **Week 1**: January 27, 2026 - NA (Complete)
- **Week 2**: February 3, 2026 - EU (Complete)
- **Week 3**: February 10, 2026 - KR (Upcoming)
- **Week 4**: February 17, 2026 - NA (Upcoming)
- **Week 5**: February 24, 2026 - EU (Upcoming)
- **Week 6**: March 3, 2026 - KR (Upcoming)

### Standings
Rankings based on completed tournaments with points, wins, and prize money distributed.

### Results
- **Week 1 NA**: Humzh wins, TFBlade runner-up, $10,000 prize pool
- **Week 2 EU**: AloisNL wins, Drututt runner-up, $10,000 prize pool

## 🔍 Troubleshooting

### "Table does not exist" error

If you get a table not found error:
1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the SQL schema from the Prerequisites section above
4. Run the queries to create the tables
5. Try running `npm run seed` again

### "Duplicate key value" error

If you get a uniqueness constraint error:
1. Run `npm run clear` to remove all existing data
2. Run `npm run seed` again

Or use `npm run reset` to do both in one command.

### "Connection refused" error

Check that:
1. Your `SUPABASE_URL` is correct in `.env`
2. Your `SUPABASE_SERVICE_KEY` (not anon key!) is set correctly
3. Your Supabase project is active and accessible

### Admin table doesn't exist

The seed script will provide SQL to create the admins table if it doesn't exist. Copy the SQL from the terminal output and run it in your Supabase SQL Editor.

## 🎯 After Seeding

Once seeding is complete:

1. **Test the Admin Panel**
   - Go to `/admin` on your frontend
   - Login with:
     - Username: `admin`
     - Password: `admin123`

2. **View the Website**
   - Visit your main site
   - You should now see:
     - 8 players on the players page
     - 6 tournaments in the schedule
     - Standings leaderboard with 8 players
     - Latest results showing Week 2 EU outcome

3. **Change Admin Password**
   - After logging in, update the admin password to something secure
   - You can do this through the Supabase dashboard or add a password change feature

4. **Customize the Data**
   - Use the admin panel to edit players, tournaments, standings, and results
   - Add new tournaments as needed
   - Update standings after each tournament

## 📝 Modifying the Seed Data

To customize the sample data:

1. Edit `scripts/seed.js`
2. Modify the arrays:
   - `samplePlayers` - Player roster
   - `sampleTournaments` - Tournament schedule
   - `sampleStandings` - Rankings
   - `sampleResults` - Tournament outcomes
3. Run `npm run reset` to apply changes

## 🔒 Security Notes

- The default admin password (`admin123`) is intentionally weak for development
- **NEVER** use this in production
- Change the password immediately after first login
- Consider adding a password change feature to your admin panel
- Use environment variables for sensitive data
- Don't commit `.env` files to version control

## ✨ Next Steps

After seeding:
1. Log into the admin panel
2. Change the admin password
3. Customize player data as needed
4. Update tournament schedule with real dates
5. Add Week 3+ participants
6. Test the CRUD operations in the admin panel
7. Deploy your backend to Render
8. Deploy your frontend to Vercel
9. Start running tournaments!

---

**Need Help?** Check the main README or the ADMIN_PANEL_GUIDE.md for more information.
