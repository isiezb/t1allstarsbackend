const supabase = require('../lib/supabase');

// Get all tournaments
exports.getTournaments = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tournaments')
      .select('*')
      .order('week', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get tournament by week
exports.getTournamentByWeek = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tournaments')
      .select('*')
      .eq('week', req.params.week)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Tournament not found' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create tournament
exports.createTournament = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tournaments')
      .insert([req.body])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update tournament
exports.updateTournament = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tournaments')
      .update({ ...req.body, updated_at: new Date() })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Tournament not found' });
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete tournament
exports.deleteTournament = async (req, res) => {
  try {
    const { error } = await supabase
      .from('tournaments')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: 'Tournament deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
