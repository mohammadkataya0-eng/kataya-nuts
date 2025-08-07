const Category = require('../models/Category');
const Item = require('../models/Item');

// POST /api/categories
exports.addCategory = async (req, res) => {
  const { name, position } = req.body;
  if (!name) return res.status(400).json({ message: 'Category name required' });

  const exists = await Category.findOne({ name });
  if (exists) return res.status(400).json({ message: 'Category already exists' });

  const category = new Category({ name, position });
  await category.save();
  res.json(category);
};

// GET /api/categories
exports.getCategories = async (req, res) => {
  const categories = await Category.find().sort({ position: 1 }); // sorted by position
  res.json(categories);
};

// PUT /api/categories/:id
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, position } = req.body;

  if (!name) return res.status(400).json({ message: 'Name is required' });

  const updated = await Category.findByIdAndUpdate(
    id,
    { name, position },
    { new: true }
  );
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

// PATCH /api/categories/:id/archive
exports.archiveCategory = async (req, res) => {
  const { id } = req.params;
  const { archived } = req.body;

  const category = await Category.findByIdAndUpdate(id, { archived }, { new: true });
  if (!category) return res.status(404).json({ message: 'Category not found' });

  await Item.updateMany({ category: id }, { archived });

  res.json({
    message: `Category ${archived ? 'archived' : 'unarchived'} and its items ${archived ? 'archived' : 'unarchived'}`,
    category
  });
};
