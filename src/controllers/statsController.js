const supabase = require('../lib/supabase');

// Get site statistics
exports.getStats = async (req, res) => {
  try {
    // Get pickems users count
    const { count: totalUsers } = await supabase
      .from('pickems_users')
      .select('*', { count: 'exact', head: true });

    // Get total picks count
    const { count: totalPicks } = await supabase
      .from('pickems')
      .select('*', { count: 'exact', head: true });

    // Get current week's picks (find the latest upcoming or live tournament)
    const { data: currentTournament } = await supabase
      .from('tournaments')
      .select('week')
      .in('status', ['upcoming', 'live'])
      .order('week', { ascending: true })
      .limit(1)
      .single();

    let picksThisWeek = 0;
    if (currentTournament) {
      const { count } = await supabase
        .from('pickems')
        .select('*', { count: 'exact', head: true })
        .eq('tournament_week', currentTournament.week);
      picksThisWeek = count || 0;
    }

    // Get players count
    const { count: totalPlayers } = await supabase
      .from('players')
      .select('*', { count: 'exact', head: true });

    // Get tournaments count
    const { count: totalTournaments } = await supabase
      .from('tournaments')
      .select('*', { count: 'exact', head: true });

    // Get upcoming tournaments count
    const { count: upcomingTournaments } = await supabase
      .from('tournaments')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'upcoming');

    // Get VODs count
    const { count: totalVods } = await supabase
      .from('vods')
      .select('*', { count: 'exact', head: true });

    res.json({
      pickems: {
        totalUsers: totalUsers || 0,
        totalPicks: totalPicks || 0,
        picksThisWeek: picksThisWeek || 0,
      },
      content: {
        totalPlayers: totalPlayers || 0,
        totalTournaments: totalTournaments || 0,
        upcomingTournaments: upcomingTournaments || 0,
        totalVods: totalVods || 0,
      },
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: error.message });
  }
};
