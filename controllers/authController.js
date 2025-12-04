const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userDal = require('../dal/userDal');
const orderDal = require('../dal/orderDal');

function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
}

exports.initAdmin = async (req, res) => {
  const { username, email, password, name } = req.body;
  if (!username || !email || !password || !name) {
    return res.status(400).json({ message: 'Username, email, name, and password are required' });
  }

  const existing = (await userDal.findUserByUsername(username)) || (await userDal.findUserByEmail(email));
  if (existing) return res.status(400).json({ message: 'Admin already exists' });

  const hash = await bcrypt.hash(password, 10);
  await userDal.createUser({ username, name, email, passwordHash: hash, role: 'admin' });

  res.json({ message: 'Admin created' });
};

exports.adminLogin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Username and password are required' });

  const admin = await userDal.findUserByUsername(username);
  if (!admin || admin.role !== 'admin') return res.status(401).json({ message: 'Invalid credentials' });

  const match = await bcrypt.compare(password, admin.password_hash);
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });

  const token = signToken(admin);
  res.json({ token, user: { id: admin.id, username: admin.username, email: admin.email, name: admin.name, role: admin.role } });
};

exports.login = async (req, res) => {
  const { username, email, password } = req.body;
  if ((!username && !email) || !password) {
    return res.status(400).json({ message: 'Username or email and password are required.' });
  }

  const user = username ? await userDal.findUserByUsername(username) : await userDal.findUserByEmail(email);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });

  const token = signToken(user);
  res.json({ token, user: { id: user.id, username: user.username, name: user.name, email: user.email, role: user.role } });
};

exports.changePassword = async (req, res) => {
  const adminId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Both current and new passwords are required.' });
  }

  const admin = await userDal.findUserById(adminId);
  if (!admin || admin.role !== 'admin') return res.status(404).json({ message: 'Admin not found.' });

  const match = await bcrypt.compare(currentPassword, admin.password_hash);
  if (!match) return res.status(401).json({ message: 'Incorrect current password.' });

  const hashed = await bcrypt.hash(newPassword, 10);
  await userDal.updateUserPassword(adminId, hashed);

  res.json({ message: 'Password changed successfully.' });
};

exports.userSignup = async (req, res) => {
  const { username, name, email, password } = req.body;
  if (!username || !name || !email || !password) {
    return res.status(400).json({ message: 'Username, name, email, and password are required.' });
  }

  const existing = (await userDal.findUserByUsername(username)) || (await userDal.findUserByEmail(email));
  if (existing) return res.status(400).json({ message: 'User already exists.' });

  const hashed = await bcrypt.hash(password, 10);
  const user = await userDal.createUser({ username, name, email, passwordHash: hashed, role: 'user' });

  const response = { id: user.id, username: user.username, name: user.name, email: user.email, role: user.role };
  const token = signToken(user);
  res.status(201).json({ token, user: response });
};

exports.userLogin = async (req, res) => {
  const { username, email, password } = req.body;
  if ((!username && !email) || !password) {
    return res.status(400).json({ message: 'Username or email and password are required.' });
  }

  const user = username ? await userDal.findUserByUsername(username) : await userDal.findUserByEmail(email);
  if (!user || user.role !== 'user') return res.status(401).json({ message: 'Invalid credentials' });

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });

  const token = signToken(user);
  res.json({ token, user: { id: user.id, username: user.username, name: user.name, email: user.email, role: user.role } });
};

exports.getProfile = async (req, res) => {
  const user = await userDal.findUserById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const { id, username, name, email, role, created_at } = user;
  res.json({ id, username, name, email, role, created_at });
};

exports.updateProfile = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Name is required to update profile.' });

  await userDal.updateUserName(req.user.id, name);
  const user = await userDal.findUserById(req.user.id);
  const { id, username, email, role, created_at } = user;
  res.json({ id, username, name: user.name, email, role, created_at });
};

exports.getUserOrders = async (req, res) => {
  const orders = await orderDal.findOrdersForUser(req.user.id);
  res.json(orders);
};

exports.createOrder = async (req, res) => {
  const { summary } = req.body;
  if (!summary || typeof summary !== 'string') {
    return res.status(400).json({ message: 'Order summary is required.' });
  }

  const order = await orderDal.createOrder({ userId: req.user.id, summary });
  res.status(201).json({ id: order.id, message: 'Order saved' });
};
