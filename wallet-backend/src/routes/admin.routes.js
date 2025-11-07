const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

/**
 * @swagger
 * tags:
 *   name: Admins
 *   description: Admin management API
 */

/**
 * @swagger
 * /admin/register:
 *   post:
 *     summary: Register a new admin
 *     tags: [Admins]
 */
router.post('/register', adminController.registerAdmin);

/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: Admin login
 *     tags: [Admins]
 */
router.post('/login', adminController.loginAdmin);

/**
 * @swagger
 * /admin:
 *   get:
 *     summary: List all admins
 *     tags: [Admins]
 */
router.get('/', adminController.listAdmins);

/**
 * @swagger
 * /admin/{id}:
 *   get:
 *     summary: Get admin profile
 *     tags: [Admins]
 */
router.get('/:id', adminController.getAdminProfile);

/**
 * @swagger
 * /admin/{id}:
 *   delete:
 *     summary: Delete an admin
 *     tags: [Admins]
 */
router.delete('/:id', adminController.deleteAdmin);

module.exports = router;


/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all registered users (admin only)
 *     tags: [Admins]
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/users', adminController.getAllUsers);

/**
 * @swagger
 * /admin/users/{id}:
 *   get:
 *     summary: Get user details by ID (admin only)
 *     tags: [Admins]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User details
 */
router.get('/users/:id', adminController.getUserById);


/**
 * @swagger
 * /admin/wallets:
 *   get:
 *     summary: Get all wallets (admin only)
 *     tags: [Admins]
 *     responses:
 *       200:
 *         description: List of wallets
 */
router.get('/wallets', adminController.getAllWallets);

/**
 * @swagger
 * /admin/wallets/{id}:
 *   get:
 *     summary: Get wallet details by ID (admin only)
 *     tags: [Admins]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Wallet details
 */
router.get('/wallets/:id', adminController.getWalletById);
