const express = require('express');
const router = express.Router();
const { estimateGas, sendTransaction, getTxDetails, sendTokenTransaction, sendTokenWithAutoGas } = require('../controller/quicknode.tx.controller');

/**
 * @swagger
 * tags:
 *   name: QuickNode Transactions
 *   description: Transaction handling, estimation, and lookup
 */

/**
 * @swagger
 * /quicknode/tx/estimate-gas:
 *   post:
 *     summary: Estimate gas required for a transaction
 *     tags: [QuickNode Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               from:
 *                 type: string
 *               to:
 *                 type: string
 *               value:
 *                 type: number
 *     responses:
 *       200:
 *         description: Gas estimate returned
 */

/**
 * @swagger
 * /quicknode/tx/send:
 *   post:
 *     summary: Send a transaction using private key
 *     tags: [QuickNode Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               privateKey:
 *                 type: string
 *               to:
 *                 type: string
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Transaction sent successfully
 */

/**
 * @swagger
 * /quicknode/tx/{hash}:
 *   get:
 *     summary: Fetch transaction details by hash
 *     tags: [QuickNode Transactions]
 *     parameters:
 *       - in: path
 *         name: hash
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction details fetched
 */

/**
 * @swagger
 * /quicknode/tx/send-token:
 *   post:
 *     summary: Send an ERC20/BEP20 token (e.g. USDT)
 *     tags: [QuickNode Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               privateKey:
 *                 type: string
 *                 description: Sender's private key
 *               to:
 *                 type: string
 *                 description: Receiver wallet address
 *               amount:
 *                 type: number
 *                 description: Amount to send
 *               tokenAddress:
 *                 type: string
 *                 description: BEP20 or ERC20 token contract address
 *               decimals:
 *                 type: number
 *                 description: (Optional) Token decimals, defaults to on-chain value
 *     responses:
 *       200:
 *         description: Token transfer transaction hash
 */

/**
 * @swagger
 * /quicknode/tx/send-token-auto:
 *   post:
 *     summary: Send token and auto swap USDT → BNB if gas insufficient
 *     tags: [QuickNode Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               privateKey:
 *                 type: string
 *               to:
 *                 type: string
 *               amount:
 *                 type: number
 *               tokenAddress:
 *                 type: string
 *               decimals:
 *                 type: number
 *     responses:
 *       200:
 *         description: Token transfer transaction hash
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */

router.post('/send-token-auto', sendTokenWithAutoGas);

router.post('/send-token', sendTokenTransaction);
router.post('/estimate-gas', estimateGas);
router.post('/send', sendTransaction);
router.get('/:hash', getTxDetails);

module.exports = router;
