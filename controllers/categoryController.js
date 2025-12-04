const categoryDal = require('../dal/categoryDal');

// POST /api/categories
exports.addCategory = async (req, res) => {
  const { name, position } = req.body;
  const posValue = Number.isFinite(Number(position)) ? Number(position) : 0;
  if (!name) return res.status(400).json({ message: 'Category name required' });

  const existing = await categoryDal.findCategoryByName(name);
  if (existing) return res.status(400).json({ message: 'Category already exists' });

  const category = await categoryDal.createCategory({ name, position: posValue });
  res.json(category);
};

// GET /api/categories
exports.getCategories = async (req, res) => {
  const categories = await categoryDal.findAllCategories();
  res.json(categories);
};

// PUT /api/categories/:id
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, position } = req.body;
  if (!name) return res.status(400).json({ message: 'Name is required' });

  const current = await categoryDal.findCategoryById(id);
  if (!current) return res.status(404).json({ message: 'Category not found' });

  const newPosition = position !== undefined ? Number(position) : current.position;
  const updated = await categoryDal.updateCategoryById(id, { name, position: newPosition });
  res.json(updated);
};

// DELETE /api/categories/:id
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  const existing = await categoryDal.findCategoryById(id);
  if (!existing) return res.status(404).json({ message: 'Category not found' });

  await categoryDal.deleteCategoryById(id);
  res.json({ message: 'Category deleted' });
};

// PATCH /api/categories/:id/archive
exports.archiveCategory = async (req, res) => {
  const { id } = req.params;
  const { archived } = req.body;
  const archiveFlag = archived === true || archived === 'true';

  const existing = await categoryDal.findCategoryById(id);
  if (!existing) return res.status(404).json({ message: 'Category not found' });

  const category = await categoryDal.setCategoryArchiveState(id, archiveFlag);
  res.json({
    message: `Category ${archiveFlag ? 'archived' : 'unarchived'} and its items ${archiveFlag ? 'archived' : 'unarchived'}`,
    category,
  });
};
