const db = require('../db/admins.db');
const usersDb = require('../db/users.db');
const walletsDb = require('../db/wallets.db');
const { success, error } = require('../utils/response');

exports.registerAdmin = (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return error(res, 'All fields required');

    const stmt = db.prepare(
      'INSERT INTO admins (name, email, password, role) VALUES (?, ?, ?, ?)'
    );
    const info = stmt.run(name, email, password, role || 'superadmin');

    success(res, { message: 'Admin registered successfully', id: info.lastInsertRowid });
  } catch (e) {
    if (e.message.includes('UNIQUE constraint')) return error(res, 'Email already exists');
    error(res, e.message);
  }
};

exports.loginAdmin = (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return error(res, 'Email and password required');

    const admin = db.prepare('SELECT * FROM admins WHERE email = ?').get(email);
    if (!admin) return error(res, 'Admin not found');
    if (admin.password !== password) return error(res, 'Invalid password');

    success(res, { message: 'Admin login successful', token: 'ADMIN_TEST_TOKEN', role: admin.role });
  } catch (e) {
    error(res, e.message);
  }
};

exports.getAdminProfile = (req, res) => {
  try {
    const { id } = req.params;
    const admin = db.prepare('SELECT id, name, email, role, created_at FROM admins WHERE id = ?').get(id);
    if (!admin) return error(res, 'Admin not found');
    success(res, admin);
  } catch (e) {
    error(res, e.message);
  }
};

exports.listAdmins = (req, res) => {
  try {
    const admins = db.prepare('SELECT id, name, email, role, created_at FROM admins').all();
    success(res, admins);
  } catch (e) {
    error(res, e.message);
  }
};

exports.deleteAdmin = (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM admins WHERE id = ?').run(id);
    success(res, { message: 'Admin deleted successfully' });
  } catch (e) {
    error(res, e.message);
  }
};

exports.getAllUsers = (req, res) => {
  try {
    const users = usersDb.prepare('SELECT id, name, email, created_at FROM users').all();
    success(res, users);
  } catch (e) {
    error(res, e.message);
  }
};

exports.getUserById = (req, res) => {
  try {
    const { id } = req.params;
    const user = usersDb.prepare('SELECT id, name, email, created_at FROM users WHERE id = ?').get(id);
    if (!user) return error(res, 'User not found');
    success(res, user);
  } catch (e) {
    error(res, e.message);
  }
};

exports.getAllWallets = (req, res) => {
  try {
    const wallets = walletsDb.prepare(`
      SELECT 
        w.id,
        w.user_id,
        u.name AS user_name,
        u.email AS user_email,
        w.address,
        w.balance,
        w.network,
        w.created_at
      FROM wallets w
      LEFT JOIN users u ON w.user_id = u.id
    `).all();
    success(res, wallets);
  } catch (e) {
    error(res, e.message);
  }
};

exports.getWalletById = (req, res) => {
  try {
    const { id } = req.params;
    const wallet = walletsDb.prepare(`
      SELECT 
        w.id,
        w.user_id,
        u.name AS user_name,
        u.email AS user_email,
        w.address,
        w.balance,
        w.network,
        w.created_at
      FROM wallets w
      LEFT JOIN users u ON w.user_id = u.id
      WHERE w.id = ?
    `).get(id);
    if (!wallet) return error(res, 'Wallet not found');
    success(res, wallet);
  } catch (e) {
    error(res, e.message);
  }
};
