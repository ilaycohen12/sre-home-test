const express = require('express');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/profile', authMiddleware, (req, res) => {
  res.json({ userId: req.user.id, username: req.user.username });
});

module.exports = router;
