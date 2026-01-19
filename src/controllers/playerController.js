const supabase = require('../lib/supabase');

// Get all players
exports.getPlayers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('players')
      .select('*');

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get player by name
exports.getPlayerByName = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('name', req.params.name)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Player not found' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create player
exports.createPlayer = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('players')
      .insert([req.body])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update player
exports.updatePlayer = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('players')
      .update({ ...req.body, updated_at: new Date() })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Player not found' });
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete player
exports.deletePlayer = async (req, res) => {
  try {
    const { error } = await supabase
      .from('players')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: 'Player deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
