const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const {
  login,
  logout,
  getMe
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/login', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
], login);

router.get('/logout', logout);
router.get('/me', protect, getMe);

module.exports = router;