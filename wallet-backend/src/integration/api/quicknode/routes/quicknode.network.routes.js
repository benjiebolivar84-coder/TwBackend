const express = require('express');
const router = express.Router();
const {
  getNetworkInfo,
  getGasPrice,
  getLatestBlockInfo
} = require('../controller/quicknode.network.controller');




/**
 * @swagger
 * tags:
 *   name: QuickNode Network
 *   description: Network information and blockchain status via QuickNode
 */

/**
 * @swagger
 * /quicknode/network/info:
 *   get:
 *     summary: Get current network information (chain ID, RPC, name)
 *     tags: [QuickNode Network]
 *     responses:
 *       200:
 *         description: Network info retrieved successfully
 *       500:
 *         description: Failed to fetch network info
 */

/**
 * @swagger
 * /quicknode/network/gas-price:
 *   get:
 *     summary: Get current gas price in Wei and Gwei
 *     tags: [QuickNode Network]
 *     responses:
 *       200:
 *         description: Gas price retrieved successfully
 *       500:
 *         description: Failed to fetch gas price
 */

/**
 * @swagger
 * /quicknode/network/latest-block:
 *   get:
 *     summary: Get details of the latest block (number, miner, tx count)
 *     tags: [QuickNode Network]
 *     responses:
 *       200:
 *         description: Latest block info retrieved successfully
 *       500:
 *         description: Failed to fetch latest block info
 */



router.get('/info', getNetworkInfo);
router.get('/gas-price', getGasPrice);
router.get('/latest-block', getLatestBlockInfo);

module.exports = router;
