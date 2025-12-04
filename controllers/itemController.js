const path = require('path');
const fs = require('fs');
const itemDal = require('../dal/itemDal');
const categoryDal = require('../dal/categoryDal');

// POST /api/items
exports.addItem = async (req, res) => {
  const { name, pricePerKg, category, position } = req.body;
  const incomingCountBased = req.body.isCountBased;
  const image = req.file ? `/images/items/${req.file.filename}` : null;
  const priceValue = Number(pricePerKg);
  const positionValue = Number(position);

  if (!name || !pricePerKg || !category || position === undefined) {
    return res.status(400).json({ message: 'Name, price, category, and position are required.' });
  }
  if (Number.isNaN(priceValue) || Number.isNaN(positionValue)) {
    return res.status(400).json({ message: 'Price and position must be numeric values.' });
  }

  const categoryExists = await categoryDal.findCategoryById(category);
  if (!categoryExists) return res.status(404).json({ message: 'Category not found' });

  const isCountBased = incomingCountBased === 'true' || incomingCountBased === true;

  const item = await itemDal.createItem({
    name,
    pricePerKg: priceValue,
    categoryId: category,
    position: positionValue,
    image,
    isCountBased,
  });

  res.json(item);
};

// GET /api/items
exports.getItems = async (req, res) => {
  const items = await itemDal.findAllItems();
  res.json(items);
};

// PUT /api/items/:id
exports.updateItem = async (req, res) => {
  const { id } = req.params;
  const { name, pricePerKg, category, position } = req.body;
  const incomingCountBased = req.body.isCountBased;
  const image = req.file ? `/images/items/${req.file.filename}` : null;

  const existing = await itemDal.findItemRowById(id);
  if (!existing) return res.status(404).json({ message: 'Item not found' });

  if (category) {
    const categoryExists = await categoryDal.findCategoryById(category);
    if (!categoryExists) return res.status(404).json({ message: 'Category not found' });
  }

  const priceValue =
    pricePerKg !== undefined && pricePerKg !== null ? Number(pricePerKg) : existing.price_per_kg;
  const positionValue =
    position !== undefined && position !== null ? Number(position) : existing.position;
  if (Number.isNaN(priceValue) || Number.isNaN(positionValue)) {
    return res.status(400).json({ message: 'Price and position must be numeric values.' });
  }

  const updated = await itemDal.updateItemById(id, {
    name: name || existing.name,
    pricePerKg: priceValue,
    categoryId: category || existing.category_id,
    position: positionValue,
    image: image || existing.image,
    isCountBased:
      incomingCountBased === undefined
        ? existing.is_count_based
        : incomingCountBased === 'true' || incomingCountBased === true,
  });

  res.json(updated);
};

// DELETE /api/items/:id
exports.deleteItem = async (req, res) => {
  const { id } = req.params;

  const existing = await itemDal.findItemRowById(id);
  if (!existing) return res.status(404).json({ message: 'Item not found' });

  const imagePath = existing.image ? path.join(__dirname, '..', 'public', existing.image) : null;
  await itemDal.deleteItemById(id);

  if (imagePath && fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
  }

  res.json({ message: 'Item and image deleted successfully' });
};

// PATCH /api/items/:id/archive
exports.toggleArchiveItem = async (req, res) => {
  const { id } = req.params;
  const { archived } = req.body;
  const archiveFlag = archived === true || archived === 'true';

  const existing = await itemDal.findItemRowById(id);
  if (!existing) return res.status(404).json({ message: 'Item not found' });

  await itemDal.setItemArchiveState(id, archiveFlag);
  res.json({ message: `Item ${archiveFlag ? 'archived' : 'unarchived'}` });
};
