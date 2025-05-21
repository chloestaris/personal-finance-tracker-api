const Transaction = require('../models/Transaction');
const Account = require('../models/Account');

// Get total balance for the logged-in user
exports.getTotalBalance = async (req, res) => {
  try {
    const accounts = await Account.find({ userId: req.user.id });
    
    let totalBalance = 0;
    accounts.forEach(account => {
      totalBalance += account.balance;
    });

    return res.status(200).json({
      success: true,
      data: {
        totalBalance
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get income vs expenses for a time period for the logged-in user
exports.getIncomeVsExpenses = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const query = { userId: req.user.id };
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const transactions = await Transaction.find(query);
    
    let totalIncome = 0;
    let totalExpenses = 0;
    
    transactions.forEach(transaction => {
      if (transaction.type === 'income') {
        totalIncome += transaction.amount;
      } else {
        totalExpenses += transaction.amount;
      }
    });
    
    return res.status(200).json({
      success: true,
      data: {
        totalIncome,
        totalExpenses,
        netCashflow: totalIncome - totalExpenses
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get expenses by category for the logged-in user
exports.getExpensesByCategory = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const matchStage = { 
      type: 'expense',
      userId: req.user.id 
    };
    
    if (startDate && endDate) {
      matchStage.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const expensesByCategory = await Transaction.aggregate([
      { $match: matchStage },
      { $group: {
          _id: '$category',
          total: { $sum: '$amount' }
        }
      },
      { $sort: { total: -1 } }
    ]);
    
    return res.status(200).json({
      success: true,
      data: expensesByCategory
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};