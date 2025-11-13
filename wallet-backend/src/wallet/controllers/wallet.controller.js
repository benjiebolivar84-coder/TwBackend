const walletService = require('../services/wallet.service');
const dbDevice = require('../../db/devicePasscodes.db');
const { success, error } = require('../../utils/response');

exports.createWallet = async (req, res) => {
  try {
    const { devicePassCodeId, walletName, mnemonic } = req.body;

    if (!devicePassCodeId) return error(res, 'devicePassCodeId is required');
    if (!walletName) return error(res, 'walletName is required');
    if (!mnemonic) return error(res, 'mnemonic passphrase is required');

    const device = dbDevice
      .prepare('SELECT id FROM device_passcodes WHERE id = ? AND is_old = 0')
      .get(devicePassCodeId);

    if (!device) return error(res, 'Active device not found');

    const newWallet = await walletService.createWallet(devicePassCodeId, walletName, mnemonic);
    success(res, newWallet);
  } catch (e) {
    error(res, e.message);
  }
};



exports.listWalletsByDevice = async (req, res) => {
  try {
    const { devicePassCodeId } = req.params;

    const device = dbDevice
      .prepare('SELECT id FROM device_passcodes WHERE id = ? AND is_old = 0')
      .get(devicePassCodeId);

    if (!device) return error(res, 'Active device not found');

    const wallets = await walletService.listWalletsByDevice(devicePassCodeId);

    success(res, wallets);
  } catch (e) {
    error(res, e.message);
  }
};


exports.getWalletDetails = async (req, res) => {
  try {
    const { walletId } = req.params;
    const wallet = await walletService.getWalletDetails(walletId);
    success(res, wallet);
  } catch (e) {
    error(res, e.message);
  }
};




exports.listAllWallets = async (req, res) => {
  try {
    const wallets = await walletService.listAllWallets();
    success(res, wallets);
  } catch (e) {
    error(res, e.message);
  }
};



exports.getWalletCredentialsSafe = async (req, res) => {
  try {
    const { walletId } = req.params;
    const credentials = await walletService.getWalletCredentials(walletId);

    if (!credentials) return error(res, 'No credentials found for this wallet');

    const safeData = {
      walletId: credentials.wallet_id,
      public_address: credentials.public_address,
      devicePassCodeId: credentials.devicePassCodeId,
      deviceId: credentials.deviceId || null,
      record_created_date: credentials.record_created_date,
      record_updated_date: credentials.record_updated_date
    };

    success(res, safeData);
  } catch (e) {
    error(res, e.message);
  }
};
