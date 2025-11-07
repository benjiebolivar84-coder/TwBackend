// wallet-backend/src/db/devicePasscodes.db.js
const Database = require('better-sqlite3');
const db = new Database('wallets.db', { verbose: console.log });

db.exec(`
  CREATE TABLE IF NOT EXISTS device_passcodes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    passcode TEXT NOT NULL,
    is_biometric_enabled INTEGER DEFAULT 0, /* New Field: 0 for false, 1 for true */
    is_old INTEGER DEFAULT 0,              /* New Field: 0 for false, 1 for true */
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

module.exports = db;