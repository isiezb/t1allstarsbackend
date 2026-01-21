const supabase = require('../lib/supabase');

// Get application URL
exports.getApplicationUrl = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('application_url')
      .select('url')
      .eq('id', 'singleton')
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update application URL
exports.updateApplicationUrl = async (req, res) => {
  try {
    const { url } = req.body;

    const { data, error } = await supabase
      .from('application_url')
      .update({ url, updated_at: new Date() })
      .eq('id', 'singleton')
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
