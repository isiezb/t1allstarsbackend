const supabase = require('../lib/supabase');

// Get all results
exports.getResults = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('results')
      .select('*')
      .order('date', { ascending: false })
      .limit(20);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create result
exports.createResult = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('results')
      .insert([req.body])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update result
exports.updateResult = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('results')
      .update({ ...req.body, updated_at: new Date() })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Result not found' });
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete result
exports.deleteResult = async (req, res) => {
  try {
    const { error } = await supabase
      .from('results')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: 'Result deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
