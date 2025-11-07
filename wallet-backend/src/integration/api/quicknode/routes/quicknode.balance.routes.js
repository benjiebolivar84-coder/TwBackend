const express = require('express');
const router = express.Router();
const { getNativeBalance, getTokenBalance } = require('../controller/quicknode.balance.controller');
/**
 * @swagger
 * tags:
 *   name: QuickNode Balance
 *   description: Fetch native and token balances via QuickNode
 */

/**
 * @swagger
 * /quicknode/balance/native:
 *   post:
 *     summary: Get native coin balance (e.g., BNB / ETH)
 *     tags: [QuickNode Balance]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Native balance retrieved
 *       400:
 *         description: Missing or invalid address
 *       500:
 *         description: Provider or network failure
 */

/**
 * @swagger
 * /quicknode/balance/token:
 *   post:
 *     summary: Get ERC20 token balance (e.g., USDT)
 *     tags: [QuickNode Balance]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address:
 *                 type: string
 *               tokenAddress:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token balance retrieved
 *       400:
 *         description: Missing address or tokenAddress
 *       500:
 *         description: Failed to fetch token balance
 */

router.post('/native', getNativeBalance);
router.post('/token', getTokenBalance);

module.exports = router;
