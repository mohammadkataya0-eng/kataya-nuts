const express = require('express');
const router = express.Router();
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');
const itemCtrl = require('../controllers/itemController');
const upload = require('../middleware/upload');

router.post('/', authenticate, requireAdmin, upload.single('image'), itemCtrl.addItem);
router.get('/', itemCtrl.getItems);
router.put('/:id', authenticate, requireAdmin, upload.single('image'), itemCtrl.updateItem);
router.delete('/:id', authenticate, requireAdmin, itemCtrl.deleteItem);
router.patch('/:id/archive', authenticate, requireAdmin, itemCtrl.toggleArchiveItem);

module.exports = router;
