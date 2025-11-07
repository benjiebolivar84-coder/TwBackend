// wallet-backend/src/routes/devicePasscodes.routes.js

const express = require('express');
const router = express.Router();
const devicePasscodesController = require('../controllers/devicePasscodes.controller');

/**
 * @swagger
 * tags:
 *   - name: DevicePassCodes
 *     description: Endpoints for managing device passcodes
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     DevicePassCode:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier of the device passcode
 *         name:
 *           type: string
 *           description: Name of the device or user
 *         is_biometric_enabled:
 *           type: boolean
 *           description: Whether biometric authentication is enabled for this device
 *         is_old:
 *           type: boolean
 *           description: Whether this record is marked as old (superseded)
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Record creation timestamp
 *     CreateDevicePassCodeInput:
 *       type: object
 *       required:
 *         - name
 *         - passcode
 *       properties:
 *         name:
 *           type: string
 *           example: MyPixel7
 *         passcode:
 *           type: string
 *           example: 123456
 *     UpdateDevicePassCodeInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: UpdatedPixel7
 *         passcode:
 *           type: string
 *           example: 654321
 *         isBiometricEnabled:
 *           type: boolean
 *           example: true
 *     UpdateBiometricStatusInput:
 *       type: object
 *       required:
 *         - isBiometricEnabled
 *       properties:
 *         isBiometricEnabled:
 *           type: boolean
 *           example: true
 */

/**
 * @swagger
 * /device-passcodes:
 *   post:
 *     summary: Create a new device passcode
 *     description: Registers a new device passcode entry in the database. Old records for the same device are marked as is_old=true.
 *     tags: [DevicePassCodes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDevicePassCodeInput'
 *     responses:
 *       201:
 *         description: Device passcode created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 id:
 *                   type: string
 *                 deviceName:
 *                   type: string
 *       400:
 *         description: Invalid request or missing parameters
 */
router.post('/', devicePasscodesController.createDevicePassCode);

/**
 * @swagger
 * /device-passcodes:
 *   get:
 *     summary: List all device passcodes
 *     description: Retrieves all saved device passcodes (without showing actual passcodes).
 *     tags: [DevicePassCodes]
 *     responses:
 *       200:
 *         description: List of device passcodes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DevicePassCode'
 */
router.get('/', devicePasscodesController.listDevicePassCodes);

/**
 * @swagger
 * /device-passcodes/{id}:
 *   get:
 *     summary: Get device passcode details by ID
 *     description: Fetches a device passcode entry by ID (without revealing passcode).
 *     tags: [DevicePassCodes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the device passcode
 *     responses:
 *       200:
 *         description: Device passcode details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DevicePassCode'
 *       404:
 *         description: Device passcode not found
 */
router.get('/:id', devicePasscodesController.getDevicePassCodeById);

/**
 * @swagger
 * /device-passcodes/{id}:
 *   put:
 *     summary: Update an existing device passcode
 *     description: Updates the name, passcode, or biometric status for the given ID.
 *     tags: [DevicePassCodes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the device passcode
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateDevicePassCodeInput'
 *     responses:
 *       200:
 *         description: Device passcode updated successfully
 *       400:
 *         description: Invalid request body or missing fields
 *       404:
 *         description: Device passcode not found
 */
router.put('/:id', devicePasscodesController.updateDevicePassCode);

/**
 * @swagger
 * /device-passcodes/{id}:
 *   delete:
 *     summary: Delete a device passcode
 *     description: Removes a device passcode entry permanently by ID.
 *     tags: [DevicePassCodes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the device passcode
 *     responses:
 *       200:
 *         description: Device passcode deleted successfully
 *       404:
 *         description: Device passcode not found
 */
router.delete('/:id', devicePasscodesController.deleteDevicePassCode);

/**
 * @swagger
 * /device-passcodes/validate:
 *   post:
 *     summary: Validate a device passcode
 *     description: Checks if the provided device name and passcode match an active record.
 *     tags: [DevicePassCodes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - passcode
 *             properties:
 *               name:
 *                 type: string
 *                 example: device001
 *               passcode:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Validation result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid input or missing parameters
 */
router.post('/validate', devicePasscodesController.validateDevicePassCode);

/**
 * @swagger
 * /device-passcodes/biometric/{name}:
 *   put:
 *     summary: Update biometric status for a device
 *     description: Enables or disables biometric authentication for the active device passcode.
 *     tags: [DevicePassCodes]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Device name (identifier)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateBiometricStatusInput'
 *     responses:
 *       200:
 *         description: Biometric status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 deviceName:
 *                   type: string
 *                 isBiometricEnabled:
 *                   type: boolean
 *       400:
 *         description: Invalid request body or missing parameters
 *       404:
 *         description: Active device passcode record not found
 */
router.put('/biometric/:name', devicePasscodesController.updateBiometricStatus);


module.exports = router;