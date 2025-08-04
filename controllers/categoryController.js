const Category = require('../models/Category');

// POST /api/categories
exports.addCategory = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Category name required' });

  const exists = await Category.findOne({ name });
  if (exists) return res.status(400).json({ message: 'Category already exists' });

  const category = new Category({ name });
  await category.save();
  res.json(category);
};

// GET /api/categories
exports.getCategories = async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });
  res.json(categories);
};

// PUT /api/categories/:id
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) return res.status(400).json({ message: 'Name is required' });

  const updated = await Category.findByIdAndUpdate(id, { name }, { new: true });
  if (!updated) return res.status(404).json({ message: 'Category not found' });

  res.json(updated);
};

// DELETE /api/categories/:id
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  const deleted = await Category.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ message: 'Category not found' });

  res.json({ message: 'Category deleted' });
};

const Item = require('../models/Item');

// PATCH /api/categories/:id/archive
exports.archiveCategory = async (req, res) => {
  const { id } = req.params;
  const { archived } = req.body;

  // 1. Update the category
  const category = await Category.findByIdAndUpdate(id, { archived }, { new: true });
  if (!category) return res.status(404).json({ message: 'Category not found' });

  // 2. Update all items that belong to this category
  await Item.updateMany({ category: id }, { archived });

  res.json({
    message: `Category ${archived ? 'archived' : 'unarchived'} and its items ${archived ? 'archived' : 'unarchived'}`,
    category
  });
};