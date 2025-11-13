const express = require('express');
const router = express.Router();
const walletNetworkController = require('../controllers/walletNetwork.controller');

/**
 * @swagger
 * tags:
 *   name: WalletNetwork
 *   description: Manage blockchain networks under wallets
 */

/**
 * @swagger
 * /wallet-network/add:
 *   post:
 *     summary: Add a new blockchain network to an existing wallet
 *     tags: [WalletNetwork]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - walletId
 *               - network
 *               - address
 *             properties:
 *               walletId:
 *                 type: string
 *                 description: ID of the parent wallet
 *               network:
 *                 type: string
 *                 description: Blockchain network name (e.g., ETH, BNB, POLYGON)
 *               address:
 *                 type: string
 *                 description: Wallet address of the blockchain network
 *     responses:
 *       200:
 *         description: Network added successfully
 *       400:
 *         description: Validation or missing parameters
 *       500:
 *         description: Internal server error
 */
router.post('/add', walletNetworkController.addWalletNetwork);

/**
 * @swagger
 * /wallet-network/balance/{network}/{address}:
 *   get:
 *     summary: Get real-time balance of a specific network address
 *     tags: [WalletNetwork]
 *     parameters:
 *       - in: path
 *         name: network
 *         required: true
 *         schema:
 *           type: string
 *         description: Blockchain network name
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: Wallet address of the network
 *     responses:
 *       200:
 *         description: Returns the real-time balance
 *       404:
 *         description: Network or address not found
 *       500:
 *         description: Internal server error
 */
router.get('/balance/:network/:address', walletNetworkController.getNetworkBalance);

/**
 * @swagger
 * /wallet-network/{walletId}:
 *   get:
 *     summary: List all blockchain networks associated with a wallet
 *     tags: [WalletNetwork]
 *     parameters:
 *       - in: path
 *         name: walletId
 *         required: true
 *         schema:
 *           type: string
 *         description: Wallet ID to fetch networks for
 *     responses:
 *       200:
 *         description: Returns all networks for the specified wallet
 *       404:
 *         description: Wallet not found
 *       500:
 *         description: Internal server error
 */
router.get('/:walletId', walletNetworkController.listWalletNetworks);

module.exports = router;
