const bcrypt = require('bcrypt');
const Admin = require('../models/Admin');

exports.changePassword = async (req, res) => {
  const adminId = req.admin.id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword)
    return res.status(400).json({ message: 'Both current and new passwords are required.' });

  try {
    const admin = await Admin.findById(adminId);
    if (!admin) return res.status(404).json({ message: 'Admin not found.' });

    const match = await bcrypt.compare(currentPassword, admin.passwordHash); // ✅ use passwordHash
    if (!match) return res.status(401).json({ message: 'Incorrect current password.' });

    const salt = await bcrypt.genSalt(10);
    admin.passwordHash = await bcrypt.hash(newPassword, salt); // ✅ use passwordHash
    await admin.save();

    res.json({ message: 'Password changed successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};
