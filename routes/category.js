const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const categoryCtrl = require('../controllers/categoryController');

router.post('/', auth, categoryCtrl.addCategory);
router.get('/', categoryCtrl.getCategories);
router.put('/:id', auth, categoryCtrl.updateCategory);
router.delete('/:id', auth, categoryCtrl.deleteCategory);
router.patch('/:id/archive', auth, categoryCtrl.archiveCategory);

module.exports = router;
