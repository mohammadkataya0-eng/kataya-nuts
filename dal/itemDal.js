const { getPool } = require('../config/db');

function mapItem(row) {
  if (!row) return null;
  return {
    ...row,
    _id: row.id,
    category: row.category_id
      ? {
          id: row.category_id,
          _id: row.category_id,
          name: row.category_name || null,
        }
      : null,
  };
}

async function createItem({ name, pricePerKg, categoryId, position, image, isCountBased }) {
  const pool = getPool();
  const [result] = await pool.query(
    'INSERT INTO items (name, price_per_kg, category_id, position, image, is_count_based) VALUES (?, ?, ?, ?, ?, ?)',
    [name, pricePerKg, categoryId, position, image, isCountBased]
  );
  return findItemWithCategory(result.insertId);
}

async function findItemWithCategory(id) {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT i.*, c.name AS category_name
     FROM items i
     LEFT JOIN categories c ON c.id = i.category_id
     WHERE i.id = ?
     LIMIT 1`,
    [id]
  );
  return mapItem(rows[0]);
}

async function findAllItems() {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT i.*, c.name AS category_name
     FROM items i
     LEFT JOIN categories c ON c.id = i.category_id
     ORDER BY i.position ASC, i.id ASC`
  );
  return rows.map(mapItem);
}

async function findItemRowById(id) {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM items WHERE id = ? LIMIT 1', [id]);
  return rows[0] || null;
}

async function updateItemById(id, fields) {
  const pool = getPool();
  await pool.query(
    `UPDATE items
     SET name = ?, price_per_kg = ?, category_id = ?, position = ?, image = ?, is_count_based = ?
     WHERE id = ?`,
    [
      fields.name,
      fields.pricePerKg,
      fields.categoryId,
      fields.position,
      fields.image,
      fields.isCountBased,
      id,
    ]
  );
  return findItemWithCategory(id);
}

async function deleteItemById(id) {
  const pool = getPool();
  await pool.query('DELETE FROM items WHERE id = ?', [id]);
}

async function setItemArchiveState(id, archived) {
  const pool = getPool();
  await pool.query('UPDATE items SET archived = ? WHERE id = ?', [archived, id]);
}

module.exports = {
  createItem,
  findItemWithCategory,
  findAllItems,
  findItemRowById,
  updateItemById,
  deleteItemById,
  setItemArchiveState,
};
