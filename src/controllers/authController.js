const supabase = require('../lib/supabase');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register admin
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if admin exists
    const { data: existing, error: checkError } = await supabase
      .from('admins')
      .select('*')
      .or(`username.eq."${username}",email.eq."${email}"`);

    if (existing && existing.length > 0) {
      return res.status(400).json({ error: 'Admin already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin
    const { data, error } = await supabase
      .from('admins')
      .insert([{ username, email, password: hashedPassword }])
      .select()
      .single();

    if (error) throw error;

    // Create JWT token
    const token = jwt.sign({ id: data.id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(201).json({ token, admin: { id: data.id, username, email } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Login admin
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email, hasPassword: !!password });

    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email)
      .single();

    console.log('Supabase query result:', { found: !!data, error: error?.message });

    if (error || !data) {
      console.log('Login failed: user not found');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, data.password);
    console.log('Password match:', isMatch);
    if (!isMatch) {
      console.log('Login failed: password mismatch');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: data.id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    console.log('Login successful for:', email);
    res.json({ token, admin: { id: data.id, username: data.username, email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get current admin
exports.getCurrentAdmin = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('admins')
      .select('id, username, email')
      .eq('id', req.adminId)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
