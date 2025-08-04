const Item = require('../models/Item');
const Category = require('../models/Category');
const path = require('path');

// Add a new item
exports.addItem = async (req, res) => {
  const { name, pricePerKg, category } = req.body;
  const image = req.file ? `/images/items/${req.file.filename}` : null;

  if (!name || !pricePerKg || !category)
    return res.status(400).json({ message: 'Name, price, and category are required.' });

  const categoryExists = await Category.findById(category);
  if (!categoryExists)
    return res.status(404).json({ message: 'Category not found' });

  const item = new Item({ name, pricePerKg, category, image });
  await item.save();
  res.json(item);
};

// Get all items with category populated
exports.getItems = async (req, res) => {
  const items = await Item.find().populate('category').sort({ createdAt: -1 });
  res.json(items);
};

// Update an item
exports.updateItem = async (req, res) => {
  const { id } = req.params;
  const { name, pricePerKg, category } = req.body;
  const image = req.file ? `/images/items/${req.file.filename}` : null;

  const item = await Item.findById(id);
  if (!item) return res.status(404).json({ message: 'Item not found' });

  if (name) item.name = name;
  if (pricePerKg) item.pricePerKg = pricePerKg;
  if (category) item.category = category;
  if (image) item.image = image;

  await item.save();
  res.json(item);
};

const fs = require('fs');


// Delete an item
exports.deleteItem = async (req, res) => {
  const { id } = req.params;

  try {
    const item = await Item.findById(id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    // Remove image file from disk
    if (item.image) {
      const imagePath = path.join(__dirname, '..', 'public', item.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Item.findByIdAndDelete(id);
    res.json({ message: 'Item and image deleted successfully' });
  } catch (err) {
    console.error('Failed to delete item or image:', err);
    res.status(500).json({ message: 'Server error during deletion.' });
  }
};

// Archive / Unarchive item
exports.toggleArchiveItem = async (req, res) => {
  const { id } = req.params;
  const { archived } = req.body;

  const item = await Item.findById(id);
  if (!item) return res.status(404).json({ message: 'Item not found' });

  item.archived = archived;
  await item.save();

  res.json({ message: `Item ${archived ? 'archived' : 'unarchived'}` });
};
