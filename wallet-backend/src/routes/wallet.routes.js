const express = require('express');
const router = express.Router();
const walletController = require('../controllers/wallet.controller');

/**
 * @swagger
 * tags:
 *   name: Wallet
 *   description: Wallet management API
 */

/**
 * @swagger
 * /wallet/register:
 *   post:
 *     summary: Register a new wallet
 *     tags: [Wallet]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - address
 *               - coin
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               coin:
 *                 type: string
 *                 enum: [eth, bsc, btc]
 *     responses:
 *       200:
 *         description: Wallet registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 */
router.post('/register', walletController.registerWallet);

/**
 * @swagger
 * /wallet:
 *   get:
 *     summary: List all registered wallets
 *     tags: [Wallet]
 *     responses:
 *       200:
 *         description: List of wallets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       address:
 *                         type: string
 *                       coin:
 *                         type: string
 */
router.get('/', walletController.listWallets);

/**
 * @swagger
 * /wallet/{coin}/{address}/balance:
 *   get:
 *     summary: Get wallet balance
 *     tags: [Wallet]
 *     parameters:
 *       - in: path
 *         name: coin
 *         schema:
 *           type: string
 *           enum: [eth, bsc, btc]
 *         required: true
 *         description: Coin type
 *       - in: path
 *         name: address
 *         schema:
 *           type: string
 *         required: true
 *         description: Wallet address
 *     responses:
 *       200:
 *         description: Wallet balance
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     coin:
 *                       type: string
 *                     balance:
 *                       type: string
 *                     note:
 *                       type: string
 */
router.get('/:coin/:address/balance', walletController.getBalance);

/**
 * @swagger
 * /wallet/{coin}/broadcast:
 *   post:
 *     summary: Broadcast a transaction
 *     tags: [Wallet]
 *     parameters:
 *       - in: path
 *         name: coin
 *         schema:
 *           type: string
 *           enum: [eth, bsc, btc]
 *         required: true
 *         description: Coin type
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rawTx
 *             properties:
 *               rawTx:
 *                 type: string
 *                 description: Raw signed transaction
 *     responses:
 *       200:
 *         description: Transaction broadcasted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     txHash:
 *                       type: string
 */
router.post('/:coin/broadcast', walletController.broadcastTx);

module.exports = router;
