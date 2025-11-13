const { walletDB } = require('../db');
const crypto = require('crypto');
const axios = require('axios');

exports.createWallet = async (devicePassCodeId, walletName, mnemonic) => {
  if (!mnemonic) throw new Error('Mnemonic passphrase is required');

  const quicknodeResponse = await axios.post('http://localhost:8083/quicknode/wallet/create', { mnemonic });
  if (!quicknodeResponse.data?.success)
    throw new Error('Failed to generate keys from mnemonic');

  const { address: publicAddress, privateKey } = quicknodeResponse.data.data;

  const walletId = crypto.randomBytes(16).toString('hex');
  walletDB.prepare(`
    INSERT INTO wallets (id, name, devicePassCodeId, public_address)
    VALUES (?, ?, ?, ?)
  `).run(walletId, walletName, devicePassCodeId, publicAddress);

  const credId = crypto.randomBytes(16).toString('hex');
  walletDB.prepare(`
    INSERT INTO credentials (
      unique_id, public_address, private_key, mnemonicpassphrase,
      wallet_id, devicePassCodeId, record_created_date, record_updated_date
    )
    VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `).run(credId, publicAddress, privateKey, mnemonic, walletId, devicePassCodeId);

  return {
    walletId,
    walletName,
    publicAddress,
    devicePassCodeId,
    created_at: new Date().toISOString(),
    walletNetworks: []  
  };
};

async function getWalletNetworks(walletId) {
  return walletDB
    .prepare(`SELECT id, address, network, created_at FROM wallet_networks WHERE wallet_id = ? ORDER BY created_at DESC`)
    .all(walletId);
}

exports.listWalletsByDevice = async (devicePassCodeId) => {
  const wallets = walletDB
    .prepare('SELECT * FROM wallets WHERE devicePassCodeId = ? ORDER BY created_at DESC')
    .all(devicePassCodeId);

  return await Promise.all(wallets.map(async wallet => {
    const walletNetworks = await getWalletNetworks(wallet.id);
    return {
      walletId: wallet.id,
      walletName: wallet.name,
      publicAddress: wallet.public_address,
      devicePassCodeId: wallet.devicePassCodeId,
      created_at: wallet.created_at,
      walletNetworks
    };
  }));
};

exports.getWalletDetails = async (walletId) => {
  const wallet = walletDB.prepare('SELECT * FROM wallets WHERE id = ?').get(walletId);
  if (!wallet) throw new Error('Wallet not found');

  const credentials = walletDB.prepare('SELECT * FROM credentials WHERE wallet_id = ?').get(walletId);
  const walletNetworks = await getWalletNetworks(walletId);

  return {
    walletId: wallet.id,
    walletName: wallet.name,
    publicAddress: wallet.public_address,
    devicePassCodeId: wallet.devicePassCodeId,
    created_at: wallet.created_at,
    credentials,
    walletNetworks
  };
};

exports.listAllWallets = async () => {
  
  const wallets = walletDB.prepare('SELECT * FROM wallets ORDER BY created_at DESC').all();

  const result = [];
  for (const wallet of wallets) {
    
    const walletNetworks = walletDB
      .prepare('SELECT id, wallet_id, address, network, created_at FROM wallet_networks WHERE wallet_id = ?')
      .all(wallet.id);

    result.push({
      walletId: wallet.id,
      walletName: wallet.name,
      publicAddress: wallet.public_address,
      devicePassCodeId: wallet.devicePassCodeId,
      created_at: wallet.created_at,
      walletNetworks, 
    });
  }

  return result;
};

exports.getWalletCredentials = async (walletId) => {
  const stmt = walletDB.prepare(`
    SELECT wallet_id, public_address, devicePassCodeId, deviceId,
           record_created_date, record_updated_date
    FROM credentials
    WHERE wallet_id = ?
  `);
  return stmt.get(walletId);
};
