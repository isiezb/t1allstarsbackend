const supabase = require('../lib/supabase');

// Calculate points for a pick based on actual results
function calculatePoints(pick, results) {
  let points = 0;

  // Check 1st-4th exact matches (3 pts) or in top 4 (1 pt)
  const top4Picks = [pick.pick_1st, pick.pick_2nd, pick.pick_3rd, pick.pick_4th];
  const top4Results = [results.place_1st, results.place_2nd, results.place_3rd, results.place_4th];

  // Exact position matches for 1st-4th
  if (pick.pick_1st === results.place_1st) points += 3;
  else if (top4Results.includes(pick.pick_1st)) points += 1;

  if (pick.pick_2nd === results.place_2nd) points += 3;
  else if (top4Results.includes(pick.pick_2nd)) points += 1;

  if (pick.pick_3rd === results.place_3rd) points += 3;
  else if (top4Results.includes(pick.pick_3rd)) points += 1;

  if (pick.pick_4th === results.place_4th) points += 3;
  else if (top4Results.includes(pick.pick_4th)) points += 1;

  // 5th-6th picks (2 pts each correct, order doesn't matter)
  const results5th6th = results.place_5th_6th || [];
  for (const p of (pick.pick_5th_6th || [])) {
    if (results5th6th.includes(p)) points += 2;
  }

  // 7th-8th picks (1 pt each correct, order doesn't matter)
  const results7th8th = results.place_7th_8th || [];
  for (const p of (pick.pick_7th_8th || [])) {
    if (results7th8th.includes(p)) points += 1;
  }

  return points;
}

// Get leaderboard (all-time rankings)
exports.getLeaderboard = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('pickems_users')
      .select('id, twitch_username, twitch_display_name, twitch_avatar_url, total_points')
      .order('total_points', { ascending: false })
      .limit(100);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all picks for a tournament week
exports.getPicksByWeek = async (req, res) => {
  try {
    const week = parseInt(req.params.week);

    const { data, error } = await supabase
      .from('pickems')
      .select(`
        *,
        pickems_users (
          twitch_username,
          twitch_display_name,
          twitch_avatar_url
        )
      `)
      .eq('tournament_week', week)
      .order('points_earned', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get current user's pick for a week
exports.getMyPick = async (req, res) => {
  try {
    const week = parseInt(req.params.week);
    const userId = req.params.userId; // Passed from frontend after auth

    const { data, error } = await supabase
      .from('pickems')
      .select('*')
      .eq('tournament_week', week)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
    res.json(data || null);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Submit or update a pick
exports.submitPick = async (req, res) => {
  try {
    const week = parseInt(req.params.week);
    const {
      user_id,
      pick_1st,
      pick_2nd,
      pick_3rd,
      pick_4th,
      pick_5th_6th,
      pick_7th_8th
    } = req.body;

    // Check if tournament is still upcoming (picks are locked once live/complete)
    const { data: tournament, error: tournamentError } = await supabase
      .from('tournaments')
      .select('status')
      .eq('week', week)
      .single();

    if (tournamentError) throw tournamentError;

    if (tournament.status !== 'upcoming') {
      return res.status(400).json({
        error: 'Picks are locked. Tournament has already started or completed.'
      });
    }

    // Validate that all 8 unique players are selected
    const allPicks = [pick_1st, pick_2nd, pick_3rd, pick_4th, ...pick_5th_6th, ...pick_7th_8th];
    const uniquePicks = new Set(allPicks);
    if (uniquePicks.size !== 8) {
      return res.status(400).json({
        error: 'You must select 8 unique players for your picks.'
      });
    }

    // Check if user already has a pick for this week
    const { data: existingPick } = await supabase
      .from('pickems')
      .select('id')
      .eq('tournament_week', week)
      .eq('user_id', user_id)
      .single();

    let result;
    if (existingPick) {
      // Update existing pick
      const { data, error } = await supabase
        .from('pickems')
        .update({
          pick_1st,
          pick_2nd,
          pick_3rd,
          pick_4th,
          pick_5th_6th,
          pick_7th_8th,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingPick.id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Insert new pick
      const { data, error } = await supabase
        .from('pickems')
        .insert({
          user_id,
          tournament_week: week,
          pick_1st,
          pick_2nd,
          pick_3rd,
          pick_4th,
          pick_5th_6th,
          pick_7th_8th,
        })
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Admin: Set tournament results and score all picks
exports.setResultsAndScore = async (req, res) => {
  try {
    const tournamentId = req.params.id;
    const {
      place_1st,
      place_2nd,
      place_3rd,
      place_4th,
      place_5th_6th,
      place_7th_8th
    } = req.body;

    // Update tournament with results
    const { data: tournament, error: updateError } = await supabase
      .from('tournaments')
      .update({
        place_1st,
        place_2nd,
        place_3rd,
        place_4th,
        place_5th_6th,
        place_7th_8th,
        status: 'complete',
        updated_at: new Date().toISOString(),
      })
      .eq('id', tournamentId)
      .select()
      .single();

    if (updateError) throw updateError;

    // Get all picks for this tournament week
    const { data: picks, error: picksError } = await supabase
      .from('pickems')
      .select('*')
      .eq('tournament_week', tournament.week);

    if (picksError) throw picksError;

    // Score each pick
    const results = {
      place_1st,
      place_2nd,
      place_3rd,
      place_4th,
      place_5th_6th,
      place_7th_8th,
    };

    // Track points per user to update their totals
    const userPoints = {};

    for (const pick of picks) {
      const points = calculatePoints(pick, results);

      await supabase
        .from('pickems')
        .update({
          points_earned: points,
          scored: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', pick.id);

      // Accumulate points for each user
      if (!userPoints[pick.user_id]) {
        userPoints[pick.user_id] = 0;
      }
      userPoints[pick.user_id] += points;
    }

    // Update each user's total_points
    for (const [userId, points] of Object.entries(userPoints)) {
      // Get current total_points
      const { data: user } = await supabase
        .from('pickems_users')
        .select('total_points')
        .eq('id', userId)
        .single();

      if (user) {
        await supabase
          .from('pickems_users')
          .update({
            total_points: (user.total_points || 0) + points,
            updated_at: new Date().toISOString(),
          })
          .eq('id', userId);
      }
    }

    res.json({
      message: `Results saved and ${picks.length} picks scored`,
      tournament,
      picksScored: picks.length,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get user by Twitch ID (for frontend to check if user exists)
exports.getUserByTwitchId = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('pickems_users')
      .select('*')
      .eq('twitch_id', req.params.twitchId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    res.json(data || null);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create or update pickems user
exports.upsertUser = async (req, res) => {
  try {
    const { twitch_id, twitch_username, twitch_display_name, twitch_avatar_url } = req.body;

    // Try to find existing user
    const { data: existing } = await supabase
      .from('pickems_users')
      .select('*')
      .eq('twitch_id', twitch_id)
      .single();

    let result;
    if (existing) {
      // Update
      const { data, error } = await supabase
        .from('pickems_users')
        .update({
          twitch_username,
          twitch_display_name,
          twitch_avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Insert
      const { data, error } = await supabase
        .from('pickems_users')
        .insert({
          twitch_id,
          twitch_username,
          twitch_display_name,
          twitch_avatar_url,
        })
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
