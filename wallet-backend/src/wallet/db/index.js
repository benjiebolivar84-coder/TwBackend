const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../../../data/wallets.db');
const walletDB = new Database(dbPath);

walletDB.exec(`
  CREATE TABLE IF NOT EXISTS wallets (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    devicePassCodeId TEXT NOT NULL,
    public_address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

walletDB.exec(`
  CREATE TABLE IF NOT EXISTS wallet_networks (
    id TEXT PRIMARY KEY,
    wallet_id TEXT NOT NULL,
    address TEXT NOT NULL,
    network TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

walletDB.exec(`
  CREATE TABLE IF NOT EXISTS credentials (
    unique_id TEXT PRIMARY KEY,
    public_address TEXT NOT NULL,
    private_key TEXT NOT NULL,
    mnemonicpassphrase TEXT NOT NULL,
    wallet_id TEXT NOT NULL,
    devicePassCodeId TEXT,
    deviceId TEXT,
    record_created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    record_updated_date DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

module.exports = { walletDB };
