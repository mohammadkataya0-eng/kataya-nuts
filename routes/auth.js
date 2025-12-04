const express = require('express');
const router = express.Router();
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');
const authController = require('../controllers/authController');

// Admin auth
router.post('/admin/init', authController.initAdmin);
router.post('/admin/login', authController.adminLogin);
router.patch('/admin/change-password', authenticate, requireAdmin, authController.changePassword);

// Combined login
router.post('/login', authController.login);

// User auth
router.post('/users/signup', authController.userSignup);
router.post('/users/login', authController.userLogin);
router.get('/users/me', authenticate, authController.getProfile);
router.patch('/users/me', authenticate, authController.updateProfile);
router.get('/users/orders', authenticate, authController.getUserOrders);
router.post('/users/orders', authenticate, authController.createOrder);

module.exports = router;
