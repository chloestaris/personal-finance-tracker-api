const express = require('express');
const router = express.Router();
const {
  getTotalBalance,
  getIncomeVsExpenses,
  getExpensesByCategory
} = require('../controllers/reportController');
const { protect } = require('../middleware/auth');

router.use(protect); // Protect all report routes

router.get('/balance', getTotalBalance);
router.get('/income-vs-expenses', getIncomeVsExpenses);
router.get('/expenses-by-category', getExpensesByCategory);

module.exports = router;