const { getPool } = require('../config/db');

async function createOrder({ userId, summary }) {
  const pool = getPool();
  const [result] = await pool.query('INSERT INTO orders (user_id, summary) VALUES (?, ?)', [userId, summary]);
  const [rows] = await pool.query('SELECT * FROM orders WHERE id = ?', [result.insertId]);
  return rows[0];
}

async function findOrdersForUser(userId) {
  const pool = getPool();
  const [rows] = await pool.query('SELECT id, summary, created_at FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId]);
  return rows;
}

module.exports = {
  createOrder,
  findOrdersForUser,
};
