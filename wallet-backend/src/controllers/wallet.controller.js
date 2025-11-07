const { createEvmWallet } = require('../utils/walletGenerator');
const { success, error } = require('../utils/response'); // Make sure to import these
const walletService = require('../services/wallet.service');

// Create wallet
exports.createWallet = (req, res) => {
  try {
    const wallet = createEvmWallet();
    success(res, wallet);
  } catch (e) {
    error(res, e.message);
  }
};

// Get wallet balance
exports.getBalance = async (req, res) => {
  try {
    const { coin, address } = req.params;
    const balance = await walletService.getBalance(coin, address);
    success(res, balance);
  } catch (e) {
    error(res, e.message);
  }
};

// Broadcast transaction
exports.broadcastTx = async (req, res) => {
  try {
    const { coin } = req.params;
    const { rawTx } = req.body;
    const tx = await walletService.broadcastTx(coin, rawTx);
    success(res, tx);
  } catch (e) {
    error(res, e.message);
  }
};

// List wallets (optional, depends on your DB)
exports.listWallets = (req, res) => {
  try {
    const wallets = require('../db').prepare('SELECT * FROM wallets').all();
    success(res, wallets);
  } catch (e) {
    error(res, e.message);
  }
};

// Register wallet
exports.registerWallet = (req, res) => {
  try {
    const { name, address, coin } = req.body;
    const db = require('../db');
    db.prepare('INSERT INTO wallets (name, address, coin) VALUES (?, ?, ?)')
      .run(name, address, coin);
    success(res, { message: 'Wallet registered successfully' });
  } catch (e) {
    error(res, e.message);
  }
};
