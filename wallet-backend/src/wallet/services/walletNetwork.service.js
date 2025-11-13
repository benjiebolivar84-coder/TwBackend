const WalletNetworkModel = require('../models/walletNetwork.model');
const axios = require('axios');

class WalletNetworkService {
  async addWalletNetwork({ wallet_id, address, network }) {
    // Check if already exists
    const existing = WalletNetworkModel.findByWallet(wallet_id)
      .find(n => n.network === network && n.address === address);
    if (existing) throw new Error('Network already added for this wallet');

    return WalletNetworkModel.create({ wallet_id, address, network });
  }

  async getNetworkBalance(network, address) {
    // In future, connect to QuickNode or RPC provider dynamically
    // For now just mock response
    try {
      // TODO: integrate real API (e.g., QuickNode, Alchemy, or BSCScan)
      const mockBalance = Math.random() * 0.5; // simulate live fetch
      return Number(mockBalance.toFixed(6));
    } catch {
      throw new Error(`Failed to fetch balance for ${network}:${address}`);
    }
  }

  async listWalletNetworks(wallet_id) {
    return WalletNetworkModel.findByWallet(wallet_id);
  }
}

module.exports = new WalletNetworkService();
