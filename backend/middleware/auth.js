const { getPool } = require('../db/connection');

async function authMiddleware(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const pool = getPool();
    const [rows] = await pool.query(
      `SELECT t.user_id, u.username
       FROM tokens t
       JOIN users u ON t.user_id = u.id
       WHERE t.token = ? AND t.expires_at > NOW()`,
      [token]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.user = { id: rows[0].user_id, username: rows[0].username };
    next();
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = authMiddleware;
