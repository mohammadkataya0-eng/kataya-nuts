const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const itemCtrl = require('../controllers/itemController');
const upload = require('../middleware/upload'); // ⬅️ Multer upload middleware

router.post('/', auth, upload.single('image'), itemCtrl.addItem);
router.get('/', itemCtrl.getItems);
router.put('/:id', auth, upload.single('image'), itemCtrl.updateItem);
router.delete('/:id', auth, itemCtrl.deleteItem);
router.patch('/:id/archive', auth, itemCtrl.toggleArchiveItem);

module.exports = router;
