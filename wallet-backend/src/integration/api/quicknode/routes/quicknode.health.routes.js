const express = require('express');
const router = express.Router();
const { checkHealth } = require('../controller/quicknode.health.controller');


/**
 * @swagger
 * tags:
 *   name: QuickNode Health
 *   description: Service and provider health monitoring
 */

/**
 * @swagger
 * /quicknode/health:
 *   get:
 *     summary: Check QuickNode service and blockchain connectivity
 *     tags: [QuickNode Health]
 *     responses:
 *       200:
 *         description: QuickNode connection healthy
 */



router.get('/', checkHealth);

module.exports = router;
