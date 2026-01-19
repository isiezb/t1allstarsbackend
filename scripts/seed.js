require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcrypt');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Sample tournament data
const samplePlayers = [
  {
    name: 'Humzh',
    region: 'NA',
    title: 'Top Lane Specialist',
    twitch: 'humzh',
    champions: ['Darius', 'Renekton', 'Mordekaiser'],
    record: '2-1',
    points: 350,
  },
  {
    name: 'AloisNL',
    region: 'EU',
    title: 'Darius One-Trick',
    twitch: 'alois_nl',
    champions: ['Darius', 'Camille', 'Sett'],
    record: '1-0',
    points: 300,
  },
  {
    name: 'Drututt',
    region: 'EU',
    title: 'Camille Master',
    twitch: 'drututt',
    champions: ['Camille', 'Fiora', 'Irelia'],
    record: '1-1',
    points: 250,
  },
  {
    name: 'TFBlade',
    region: 'NA',
    title: 'Challenger Top',
    twitch: 'tfblade',
    champions: ['Jax', 'Irelia', 'Akali'],
    record: '0-2',
    points: 220,
  },
  {
    name: 'Nemesis',
    region: 'EU',
    title: 'Ex-Fnatic Mid',
    twitch: 'nemesis_lol',
    champions: ['Twisted Fate', 'Orianna', 'Syndra'],
    record: '0-1',
    points: 200,
  },
  {
    name: 'Solarbacca',
    region: 'NA',
    title: 'Tank Specialist',
    twitch: 'solarbacca',
    champions: ['Shen', 'Ornn', 'Malphite'],
    record: '0-1',
    points: 180,
  },
  {
    name: 'Agurin',
    region: 'EU',
    title: 'Jungle Main',
    twitch: 'agurin',
    champions: ['Graves', 'Nidalee', 'Kha\'Zix'],
    record: '0-1',
    points: 150,
  },
  {
    name: 'Adrian',
    region: 'NA',
    title: 'Riven God',
    twitch: 'adrianaries',
    champions: ['Riven', 'Fiora', 'Yasuo'],
    record: '0-1',
    points: 120,
  },
];

const sampleTournaments = [
  {
    week: 1,
    date: 'January 27, 2026',
    region: 'NA',
    status: 'complete',
    participants: ['Humzh', 'TFBlade', 'Solarbacca', 'Adrian', 'Pstar', 'Quantum', 'Manco', 'Tyler1'],
  },
  {
    week: 2,
    date: 'February 3, 2026',
    region: 'EU',
    status: 'complete',
    participants: ['AloisNL', 'Drututt', 'NattyNatt', 'Nemesis', 'Baus', 'Thebausffs', 'Agurin', 'Elite500'],
  },
  {
    week: 3,
    date: 'February 10, 2026',
    region: 'KR',
    status: 'upcoming',
    participants: ['Zeus', 'Keria', 'Chovy', 'Faker', 'Deft', 'Ruler', 'ShowMaker', 'Canyon'],
  },
  {
    week: 4,
    date: 'February 17, 2026',
    region: 'NA',
    status: 'upcoming',
    participants: [],
  },
  {
    week: 5,
    date: 'February 24, 2026',
    region: 'EU',
    status: 'upcoming',
    participants: [],
  },
  {
    week: 6,
    date: 'March 3, 2026',
    region: 'KR',
    status: 'upcoming',
    participants: [],
  },
];

const sampleStandings = [
  { rank: 1, name: 'Humzh', region: 'NA', points: 350, tournaments: 4, wins: 2, prize: 15000 },
  { rank: 2, name: 'AloisNL', region: 'EU', points: 300, tournaments: 3, wins: 1, prize: 10000 },
  { rank: 3, name: 'Drututt', region: 'EU', points: 250, tournaments: 4, wins: 1, prize: 7000 },
  { rank: 4, name: 'TFBlade', region: 'NA', points: 220, tournaments: 3, wins: 0, prize: 3000 },
  { rank: 5, name: 'Nemesis', region: 'EU', points: 200, tournaments: 2, wins: 0, prize: 2000 },
  { rank: 6, name: 'Solarbacca', region: 'NA', points: 180, tournaments: 3, wins: 0, prize: 1500 },
  { rank: 7, name: 'Agurin', region: 'EU', points: 150, tournaments: 2, wins: 0, prize: 1000 },
  { rank: 8, name: 'Adrian', region: 'NA', points: 120, tournaments: 2, wins: 0, prize: 500 },
];

const sampleResults = [
  {
    tournament: 'Week 1 - NA All Stars',
    date: 'January 27, 2026',
    winner: 'Humzh',
    runner_up: 'TFBlade',
    region: 'NA',
    prize_pool: 10000,
  },
  {
    tournament: 'Week 2 - EU All Stars',
    date: 'February 3, 2026',
    winner: 'AloisNL',
    runner_up: 'Drututt',
    region: 'EU',
    prize_pool: 10000,
  },
];

async function seedDatabase() {
  console.log('🌱 Starting database seed...\n');

  try {
    // 1. Create admin user
    console.log('👤 Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const { data: adminData, error: adminError } = await supabase
      .from('admins')
      .insert([
        {
          username: 'admin',
          password: hashedPassword,
        },
      ])
      .select();

    if (adminError) {
      // If table doesn't exist, provide instructions
      if (adminError.code === '42P01') {
        console.error('❌ Error: admins table does not exist.');
        console.log('\n📝 Please create the admins table in Supabase:');
        console.log(`
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
        `);
        return;
      }
      console.error('❌ Error creating admin:', adminError.message);
    } else {
      console.log('✅ Admin user created successfully!');
      console.log('   Username: admin');
      console.log('   Password: admin123');
      console.log('   🔒 IMPORTANT: Change this password after first login!\n');
    }

    // 2. Seed players
    console.log('👥 Seeding players...');
    const { data: playersData, error: playersError } = await supabase
      .from('players')
      .insert(samplePlayers)
      .select();

    if (playersError) {
      console.error('❌ Error seeding players:', playersError.message);
    } else {
      console.log(`✅ Created ${playersData.length} players\n`);
    }

    // 3. Seed tournaments
    console.log('🏆 Seeding tournaments...');
    const { data: tournamentsData, error: tournamentsError } = await supabase
      .from('tournaments')
      .insert(sampleTournaments)
      .select();

    if (tournamentsError) {
      console.error('❌ Error seeding tournaments:', tournamentsError.message);
    } else {
      console.log(`✅ Created ${tournamentsData.length} tournaments\n`);
    }

    // 4. Seed standings
    console.log('📈 Seeding standings...');
    const { data: standingsData, error: standingsError } = await supabase
      .from('standings')
      .insert(sampleStandings)
      .select();

    if (standingsError) {
      console.error('❌ Error seeding standings:', standingsError.message);
    } else {
      console.log(`✅ Created ${standingsData.length} standings entries\n`);
    }

    // 5. Seed results
    console.log('🎯 Seeding results...');
    const { data: resultsData, error: resultsError } = await supabase
      .from('results')
      .insert(sampleResults)
      .select();

    if (resultsError) {
      console.error('❌ Error seeding results:', resultsError.message);
    } else {
      console.log(`✅ Created ${resultsData.length} results\n`);
    }

    console.log('🎉 Database seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - Admin users: 1`);
    console.log(`   - Players: ${playersData?.length || 0}`);
    console.log(`   - Tournaments: ${tournamentsData?.length || 0}`);
    console.log(`   - Standings: ${standingsData?.length || 0}`);
    console.log(`   - Results: ${resultsData?.length || 0}`);
    console.log('\n✨ You can now log into the admin panel at /admin');
    console.log('   Username: admin');
    console.log('   Password: admin123\n');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the seed function
seedDatabase()
  .then(() => {
    console.log('✅ Seed script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seed script failed:', error);
    process.exit(1);
  });
