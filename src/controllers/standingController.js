const Standing = require('../models/Standing');

// Get all standings
exports.getStandings = async (req, res) => {
  try {
    const standings = await Standing.find().sort({ rank: 1 });
    res.json(standings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create standing
exports.createStanding = async (req, res) => {
  try {
    const standing = new Standing(req.body);
    await standing.save();
    res.status(201).json(standing);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update standing
exports.updateStanding = async (req, res) => {
  try {
    const standing = await Standing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!standing) return res.status(404).json({ error: 'Standing not found' });
    standing.updatedAt = Date.now();
    await standing.save();
    res.json(standing);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete standing
exports.deleteStanding = async (req, res) => {
  try {
    const standing = await Standing.findByIdAndDelete(req.params.id);
    if (!standing) return res.status(404).json({ error: 'Standing not found' });
    res.json({ message: 'Standing deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
