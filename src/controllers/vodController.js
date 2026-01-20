const supabase = require('../lib/supabase');

// Get all VODs
exports.getVODs = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('vods')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create VOD
exports.createVOD = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('vods')
      .insert([req.body])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update VOD
exports.updateVOD = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('vods')
      .update({ ...req.body, updated_at: new Date() })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'VOD not found' });
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete VOD
exports.deleteVOD = async (req, res) => {
  try {
    const { error } = await supabase
      .from('vods')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: 'VOD deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
