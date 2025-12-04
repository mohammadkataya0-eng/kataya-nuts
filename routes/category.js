const express = require('express');
const router = express.Router();
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');
const categoryCtrl = require('../controllers/categoryController');

router.post('/', authenticate, requireAdmin, categoryCtrl.addCategory);
router.get('/', categoryCtrl.getCategories);
router.put('/:id', authenticate, requireAdmin, categoryCtrl.updateCategory);
router.delete('/:id', authenticate, requireAdmin, categoryCtrl.deleteCategory);
router.patch('/:id/archive', authenticate, requireAdmin, categoryCtrl.archiveCategory);

module.exports = router;
