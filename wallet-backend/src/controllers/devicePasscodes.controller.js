// wallet-backend/src/controllers/devicePasscodes.controller.js
const db = require('../db/devicePasscodes.db');
const { success, error } = require('../utils/response');
const crypto = require('crypto');

const generateId = () => crypto.randomBytes(16).toString('hex');

exports.createDevicePassCode = (req, res) => {
  try {
    const { name, passcode } = req.body;
    if (!name || !passcode) return error(res, 'Name (device ID) and passcode are required');

    const updateStmt = db.prepare(
      'UPDATE device_passcodes SET is_old = 1 WHERE name = ?'
    );
    updateStmt.run(name);

    const id = generateId();
    const insertStmt = db.prepare(
      'INSERT INTO device_passcodes (id, name, passcode, is_old, is_biometric_enabled) VALUES (?, ?, ?, 0, 0)'
    );
    insertStmt.run(id, name, passcode);

    success(res, { 
        message: 'Device passcode created successfully. Old records marked as IsOld=true.', 
        id,
        deviceName: name 
    });
  } catch (e) {
    error(res, e.message);
  }
};
exports.listDevicePassCodes = (req, res) => {
  try {
    const passcodes = db.prepare(`
        SELECT 
            id, 
            name,
            passcode, 
            is_biometric_enabled, 
            is_old, 
            created_at 
        FROM device_passcodes
    `).all();
    success(res, passcodes);
  } catch (e) {
    error(res, e.message);
  }
};

exports.getDevicePassCodeById = (req, res) => {
  try {
    const { id } = req.params;
    const passcode = db.prepare(`
        SELECT 
            id, 
            name, 
            is_biometric_enabled, 
            is_old, 
            created_at 
        FROM device_passcodes 
        WHERE id = ?
    `).get(id);
    if (!passcode) return error(res, 'Device passcode record not found');
    success(res, passcode);
  } catch (e) {
    error(res, e.message);
  }
};

exports.updateDevicePassCode = (req, res) => {
  try {
    const { id } = req.params;
    const { name, passcode, isBiometricEnabled } = req.body;
    
    if (!name && !passcode && isBiometricEnabled === undefined) return error(res, 'No fields provided for update');
    
    let query = 'UPDATE device_passcodes SET ';
    const params = [];
    const updates = [];

    if (name) {
      updates.push('name = ?');
      params.push(name);
    }
    if (passcode) {
      updates.push('passcode = ?');
      params.push(passcode);
    }
    if (isBiometricEnabled !== undefined) {
      updates.push('is_biometric_enabled = ?');
      params.push(isBiometricEnabled ? 1 : 0);
    }
    
    query += updates.join(', ') + ' WHERE id = ?';
    params.push(id);

    const info = db.prepare(query).run(...params);

    if (info.changes === 0) return error(res, 'Device passcode not found or no changes made');

    success(res, { message: 'Device passcode updated successfully' });
  } catch (e) {
    error(res, e.message);
  }
};

exports.deleteDevicePassCode = (req, res) => {
  try {
    const { id } = req.params;
    const info = db.prepare('DELETE FROM device_passcodes WHERE id = ?').run(id);
    if (info.changes === 0) return error(res, 'Device passcode not found');
    success(res, { message: 'Device passcode deleted successfully' });
  } catch (e) {
    error(res, e.message);
  }
};

exports.validateDevicePassCode = (req, res) => {
  try {
    const { name, passcode } = req.body;

    if (!name || !passcode)
      return error(res, 'Device name and passcode are required');

    const record = db
      .prepare('SELECT passcode FROM device_passcodes WHERE name = ? AND is_old = 0')
      .get(name);

    if (!record) return success(res, { valid: false, message: 'Active device passcode not found' });

    const isValid = record.passcode === passcode;

    success(res, { valid: isValid, message: isValid ? 'Passcode valid' : 'Invalid passcode' });
  } catch (e) {
    error(res, e.message);
  }
};

exports.updateBiometricStatus = (req, res) => {
  try {
    const { name } = req.params;
    const { isBiometricEnabled } = req.body;
    
    if (isBiometricEnabled === undefined) return error(res, 'isBiometricEnabled is required');

    const status = isBiometricEnabled ? 1 : 0;

    const stmt = db.prepare(`
        UPDATE device_passcodes 
        SET is_biometric_enabled = ? 
        WHERE name = ? AND is_old = 0
    `);
    
    const info = stmt.run(status, name);

    if (info.changes === 0) return error(res, 'Active device passcode record not found for this device ID, or no change made');

    success(res, { 
        message: 'Biometric status updated successfully for active device passcode',
        deviceName: name,
        isBiometricEnabled: isBiometricEnabled
    });
  } catch (e) {
    error(res, e.message);
  }
};