const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// Register admin
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if admin exists
    let admin = await Admin.findOne({ $or: [{ username }, { email }] });
    if (admin) {
      return res.status(400).json({ error: 'Admin already exists' });
    }

    admin = new Admin({ username, email, password });
    await admin.save();

    // Create JWT token
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(201).json({ token, admin: { id: admin._id, username, email } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Login admin
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({ token, admin: { id: admin._id, username: admin.username, email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get current admin
exports.getCurrentAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId).select('-password');
    res.json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
