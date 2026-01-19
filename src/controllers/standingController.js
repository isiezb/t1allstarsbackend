const supabase = require('../lib/supabase');

// Get all standings
exports.getStandings = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('standings')
      .select('*')
      .order('rank', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create standing
exports.createStanding = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('standings')
      .insert([req.body])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update standing
exports.updateStanding = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('standings')
      .update({ ...req.body, updated_at: new Date() })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Standing not found' });
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete standing
exports.deleteStanding = async (req, res) => {
  try {
    const { error } = await supabase
      .from('standings')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: 'Standing deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
