const express = require('express');
const router = express.Router();
const walletController = require('../controllers/wallet.controller');

/**
 * @swagger
 * tags:
 *   name: Wallet
 *   description: Wallet management for user devices (multi-wallet + multi-coin support)
 */

/**
 * @swagger
 * /wallet/create:
 *   post:
 *     summary: Create a new wallet for a device (multi-wallet supported)
 *     tags: [Wallet]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - devicePassCodeId
 *               - walletName
 *               - mnemonic
 *             properties:
 *               devicePassCodeId:
 *                 type: string
 *                 description: Existing device passcode ID (must be active)
 *                 example: "58e634c7e4f7704f6dfd9018e5bd7726"
 *               walletName:
 *                 type: string
 *                 description: Wallet name (unique per device)
 *                 example: "Main Wallet"
 *               mnemonic:
 *                 type: string
 *                 description: 12-word mnemonic passphrase used to derive wallet keys
 *                 example: "crane short avocado love outer control dress same myself tiger prevent must"
 *     responses:
 *       200:
 *         description: Wallet created successfully with linked credentials
 *       400:
 *         description: Validation or missing parameters
 *       500:
 *         description: Internal server error
 */
router.post('/create', walletController.createWallet);

/**
 * @swagger
 * /wallet/device/{devicePassCodeId}:
 *   get:
 *     summary: Get all wallets linked to a specific device (multi-wallet support)
 *     tags: [Wallet]
 *     parameters:
 *       - in: path
 *         name: devicePassCodeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Device passcode ID used to fetch related wallets
 *     responses:
 *       200:
 *         description: Returns list of wallets (each may have multiple coins/accounts)
 *       404:
 *         description: Device or wallets not found
 */
router.get('/device/:devicePassCodeId', walletController.listWalletsByDevice);

/**
 * @swagger
 * /wallet/{walletId}:
 *   get:
 *     summary: Get detailed wallet information (with multi-coin accounts and credentials)
 *     tags: [Wallet]
 *     parameters:
 *       - in: path
 *         name: walletId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique wallet ID
 *     responses:
 *       200:
 *         description: Wallet details including linked accounts and credentials (public info only)
 *       404:
 *         description: Wallet not found
 */
router.get('/:walletId', walletController.getWalletDetails);

/**
 * @swagger
 * /wallet:
 *   get:
 *     summary: List all wallets across all devices (admin/debug)
 *     tags: [Wallet]
 *     responses:
 *       200:
 *         description: Returns all wallets in the system
 */
router.get('/', walletController.listAllWallets);

/**
 * @swagger
 * /wallet/{walletId}/credentials:
 *   get:
 *     summary: Get wallet credentials (restricted view — excludes private key & mnemonic)
 *     tags: [Wallet]
 *     parameters:
 *       - in: path
 *         name: walletId
 *         required: true
 *         schema:
 *           type: string
 *         description: Wallet ID for which to fetch credentials
 *     responses:
 *       200:
 *         description: Returns wallet credentials (public address + metadata)
 *       404:
 *         description: Credentials not found for wallet
 */
router.get('/:walletId/credentials', walletController.getWalletCredentialsSafe);

module.exports = router;
