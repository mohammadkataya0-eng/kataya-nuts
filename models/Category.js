// ✅ category.model.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  archived: { type: Boolean, default: false },
  position: { type: Number, default: 0 }, // ordering field
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Category', categorySchema);
