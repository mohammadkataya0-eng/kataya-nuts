// ✅ item.model.js
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  pricePerKg: { type: Number, required: true },
  image: { type: String, default: null },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  archived: { type: Boolean, default: false },
  position: { type: Number, default: 0 }, // ordering field
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Item', itemSchema);
