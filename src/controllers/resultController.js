const Result = require('../models/Result');

// Get all results
exports.getResults = async (req, res) => {
  try {
    const results = await Result.find().sort({ date: -1 }).limit(20);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create result
exports.createResult = async (req, res) => {
  try {
    const result = new Result(req.body);
    await result.save();
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update result
exports.updateResult = async (req, res) => {
  try {
    const result = await Result.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!result) return res.status(404).json({ error: 'Result not found' });
    result.updatedAt = Date.now();
    await result.save();
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete result
exports.deleteResult = async (req, res) => {
  try {
    const result = await Result.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Result not found' });
    res.json({ message: 'Result deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
