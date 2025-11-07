const db = require('../db/users.db');
const { success, error } = require('../utils/response');

exports.registerUser = (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return error(res, 'All fields required');

    const stmt = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
    const info = stmt.run(name, email, password);

    success(res, { message: 'User registered successfully', id: info.lastInsertRowid });
  } catch (e) {
    if (e.message.includes('UNIQUE constraint')) return error(res, 'Email already exists');
    error(res, e.message);
  }
};

exports.loginUser = (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return error(res, 'Email and password required');

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) return error(res, 'User not found');
    if (user.password !== password) return error(res, 'Invalid password');

    success(res, { message: 'Login successful', token: 'TEST_TOKEN' });
  } catch (e) {
    error(res, e.message);
  }
};

exports.getUserProfile = (req, res) => {
  try {
    const { id } = req.params;
    const user = db.prepare('SELECT id, name, email, created_at FROM users WHERE id = ?').get(id);
    if (!user) return error(res, 'User not found');

    success(res, user);
  } catch (e) {
    error(res, e.message);
  }
};

exports.updateUserProfile = (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    if (!user) return error(res, 'User not found');

    db.prepare('UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?')
      .run(name || user.name, email || user.email, password || user.password, id);

    success(res, { message: 'User profile updated successfully' });
  } catch (e) {
    error(res, e.message);
  }
};

exports.deleteUser = (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM users WHERE id = ?').run(id);
    success(res, { message: 'User deleted successfully' });
  } catch (e) {
    error(res, e.message);
  }
};

exports.listUsers = (req, res) => {
  try {
    const users = db.prepare('SELECT id, name, email, created_at FROM users').all();
    success(res, users);
  } catch (e) {
    error(res, e.message);
  }
};
