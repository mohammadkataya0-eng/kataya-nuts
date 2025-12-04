const { getPool } = require('../config/db');

async function mapCategory(row) {
  if (!row) return null;
  return { ...row, _id: row.id };
}

async function createCategory({ name, position }) {
  const pool = getPool();
  const [result] = await pool.query('INSERT INTO categories (name, position) VALUES (?, ?)', [name, position]);
  const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [result.insertId]);
  return mapCategory(rows[0]);
}

async function findCategoryByName(name) {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM categories WHERE name = ? LIMIT 1', [name]);
  return mapCategory(rows[0]);
}

async function findCategoryById(id) {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM categories WHERE id = ? LIMIT 1', [id]);
  return mapCategory(rows[0]);
}

async function findAllCategories() {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM categories ORDER BY position ASC, id ASC');
  return rows.map((row) => ({ ...row, _id: row.id }));
}

async function updateCategoryById(id, { name, position }) {
  const pool = getPool();
  await pool.query('UPDATE categories SET name = ?, position = ? WHERE id = ?', [name, position, id]);
  return findCategoryById(id);
}

async function deleteCategoryById(id) {
  const pool = getPool();
  await pool.query('DELETE FROM categories WHERE id = ?', [id]);
}

async function setCategoryArchiveState(id, archived) {
  const pool = getPool();
  await pool.query('UPDATE categories SET archived = ? WHERE id = ?', [archived, id]);
  await pool.query('UPDATE items SET archived = ? WHERE category_id = ?', [archived, id]);
  return findCategoryById(id);
}

module.exports = {
  createCategory,
  findCategoryByName,
  findCategoryById,
  findAllCategories,
  updateCategoryById,
  deleteCategoryById,
  setCategoryArchiveState,
};
