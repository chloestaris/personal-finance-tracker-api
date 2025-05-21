const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const {
  registerUser,
  updateProfile,
  getMe
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.post('/register', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], registerUser);

router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;