const Tournament = require('../models/Tournament');

// Get all tournaments
exports.getTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament.find().sort({ week: 1 });
    res.json(tournaments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get tournament by week
exports.getTournamentByWeek = async (req, res) => {
  try {
    const tournament = await Tournament.findOne({ week: req.params.week });
    if (!tournament) return res.status(404).json({ error: 'Tournament not found' });
    res.json(tournament);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create tournament
exports.createTournament = async (req, res) => {
  try {
    const tournament = new Tournament(req.body);
    await tournament.save();
    res.status(201).json(tournament);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update tournament
exports.updateTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!tournament) return res.status(404).json({ error: 'Tournament not found' });
    tournament.updatedAt = Date.now();
    await tournament.save();
    res.json(tournament);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete tournament
exports.deleteTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findByIdAndDelete(req.params.id);
    if (!tournament) return res.status(404).json({ error: 'Tournament not found' });
    res.json({ message: 'Tournament deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
