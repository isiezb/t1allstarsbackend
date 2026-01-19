require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function clearDatabase() {
  console.log('🗑️  Starting database cleanup...\n');

  try {
    // Clear in reverse order to avoid foreign key issues
    console.log('🧹 Clearing results...');
    const { error: resultsError } = await supabase
      .from('results')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (resultsError) {
      console.error('❌ Error clearing results:', resultsError.message);
    } else {
      console.log('✅ Results cleared\n');
    }

    console.log('🧹 Clearing standings...');
    const { error: standingsError } = await supabase
      .from('standings')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (standingsError) {
      console.error('❌ Error clearing standings:', standingsError.message);
    } else {
      console.log('✅ Standings cleared\n');
    }

    console.log('🧹 Clearing tournaments...');
    const { error: tournamentsError } = await supabase
      .from('tournaments')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (tournamentsError) {
      console.error('❌ Error clearing tournaments:', tournamentsError.message);
    } else {
      console.log('✅ Tournaments cleared\n');
    }

    console.log('🧹 Clearing players...');
    const { error: playersError } = await supabase
      .from('players')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (playersError) {
      console.error('❌ Error clearing players:', playersError.message);
    } else {
      console.log('✅ Players cleared\n');
    }

    console.log('🧹 Clearing admins...');
    const { error: adminsError } = await supabase
      .from('admins')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (adminsError) {
      console.error('❌ Error clearing admins:', adminsError.message);
    } else {
      console.log('✅ Admins cleared\n');
    }

    console.log('🎉 Database cleared successfully!\n');
    console.log('💡 Run "npm run seed" to populate with sample data\n');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

clearDatabase()
  .then(() => {
    console.log('✅ Clear script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Clear script failed:', error);
    process.exit(1);
  });
