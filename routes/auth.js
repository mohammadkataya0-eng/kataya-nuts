const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Admin = require('../models/Admin');

// Route: POST /api/init
router.post('/init', async (req, res) => {
  const { username, password } = req.body;
  const existing = await Admin.findOne({ username });
  if (existing) return res.status(400).json({ message: 'Admin already exists' });

  const passwordHash = await bcrypt.hash(password, 10);
  const newAdmin = new Admin({ username, passwordHash });
  await newAdmin.save();

  res.json({ message: 'Admin created' });
});

// ✅ Route: POST /api/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const admin = await Admin.findOne({ username });
  if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  res.json({ token });
});
const authMiddleware = require('../middleware/authMiddleware');


router.patch('/admin/change-password', authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Both current and new passwords are required.' });
  }

  try {
    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found.' });
    }

    const match = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!match) {
      return res.status(401).json({ message: 'Incorrect current password.' });
    }

    admin.passwordHash = await bcrypt.hash(newPassword, 10);
    await admin.save();

    res.json({ message: 'Password changed successfully.' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
