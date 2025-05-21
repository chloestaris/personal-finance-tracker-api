const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const {
  getTransactions,
  addTransaction,
  deleteTransaction
} = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');

router.use(protect); // Protect all transaction routes

router
  .route('/')
  .get(getTransactions)
  .post([
    check('type', 'Type is required').not().isEmpty(),
    check('type', 'Type must be either income or expense').isIn(['income', 'expense']),
    check('amount', 'Amount is required').not().isEmpty(),
    check('amount', 'Amount must be a positive number').isFloat({ min: 0.01 }),
    check('description', 'Description is required').not().isEmpty(),
    check('category', 'Category is required').not().isEmpty(),
    check('accountId', 'Account ID is required').not().isEmpty()
  ], addTransaction);

router
  .route('/:id')
  .delete(deleteTransaction);

module.exports = router;