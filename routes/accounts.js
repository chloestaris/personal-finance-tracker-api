const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const {
  getAccounts,
  getAccount,
  addAccount,
  updateAccount
} = require('../controllers/accountController');
const { protect } = require('../middleware/auth');

router.use(protect); // Protect all account routes

router
  .route('/')
  .get(getAccounts)
  .post([
    check('name', 'Name is required').not().isEmpty(),
    check('type', 'Type is required').not().isEmpty(),
    check('type', 'Invalid account type').isIn(['checking', 'savings', 'credit', 'investment'])
  ], addAccount);

router
  .route('/:id')
  .get(getAccount)
  .put(updateAccount);

module.exports = router;