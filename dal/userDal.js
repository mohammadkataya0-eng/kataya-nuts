const { getPool } = require('../config/db');

async function createUser({ username, name, email, passwordHash, role = 'user' }) {
  const pool = getPool();
  const [result] = await pool.query(
    'INSERT INTO users (username, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
    [username, name, email, passwordHash, role]
  );
  const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
  return rows[0];
}

async function findUserByUsername(username) {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM users WHERE username = ? LIMIT 1', [username]);
  return rows[0] || null;
}

async function findUserByEmail(email) {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
  return rows[0] || null;
}

async function findUserById(id) {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
  return rows[0] || null;
}

async function updateUserPassword(id, passwordHash) {
  const pool = getPool();
  await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [passwordHash, id]);
}

async function updateUserName(id, name) {
  const pool = getPool();
  await pool.query('UPDATE users SET name = ? WHERE id = ?', [name, id]);
}

module.exports = {
  createUser,
  findUserByUsername,
  findUserByEmail,
  findUserById,
  updateUserPassword,
  updateUserName,
};
