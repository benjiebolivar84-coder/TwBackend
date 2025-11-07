const express = require('express');
const router = express.Router();
const { getBlock, getTransactionCount } = require('../controller/quicknode.chain.controller');




/**
 * @swagger
 * tags:
 *   name: QuickNode Chain
 *   description: Chain block and transaction information
 */

/**
 * @swagger
 * /quicknode/chain/block/{number}:
 *   get:
 *     summary: Get block details by block number (latest if not provided)
 *     tags: [QuickNode Chain]
 *     parameters:
 *       - in: path
 *         name: number
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Block details retrieved
 */

/**
 * @swagger
 * /quicknode/chain/txcount/{address}:
 *   get:
 *     summary: Get total transactions count for an address
 *     tags: [QuickNode Chain]
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction count retrieved
 */


router.get('/block/:number?', getBlock);
router.get('/txcount/:address', getTransactionCount);

module.exports = router;
