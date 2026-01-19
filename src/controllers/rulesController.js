const supabase = require('../lib/supabase');

// Get rules content
exports.getRules = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('rules')
      .select('*')
      .single();

    if (error) {
      // If no rules exist yet, return default structure
      if (error.code === 'PGRST116') {
        return res.json({
          id: null,
          content: '',
          updated_at: null,
        });
      }
      throw error;
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update rules content (admin only)
exports.updateRules = async (req, res) => {
  try {
    const { content } = req.body;

    // Check if rules entry exists
    const { data: existing } = await supabase
      .from('rules')
      .select('id')
      .single();

    let result;
    if (existing) {
      // Update existing
      const { data, error } = await supabase
        .from('rules')
        .update({ content, updated_at: new Date() })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Create new
      const { data, error } = await supabase
        .from('rules')
        .insert([{ content }])
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
