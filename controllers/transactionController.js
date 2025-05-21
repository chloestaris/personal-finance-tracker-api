const Transaction = require('../models/Transaction');
const Account = require('../models/Account');
const { validationResult } = require('express-validator');

// Get all transactions for the logged-in user
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id }).sort({ date: -1 });
    return res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Add new transaction
exports.addTransaction = async (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const { type, amount, description, category, accountId } = req.body;
    
    // Check if account exists and belongs to the user
    const account = await Account.findOne({ 
      _id: accountId,
      userId: req.user.id
    });
    
    if (!account) {
      return res.status(404).json({
        success: false,
        error: 'Account not found or does not belong to you'
      });
    }
    
    // Create transaction
    const newTransaction = await Transaction.create({
      type,
      amount,
      description,
      category,
      accountId,
      userId: req.user.id
    });

    // Update account balance
    if (type === 'income') {
      account.balance += amount;
    } else {
      account.balance -= amount;
    }
    
    await account.save();

    return res.status(201).json({
      success: true,
      data: newTransaction
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Delete transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found or not authorized'
      });
    }

    // Update account balance before removing transaction
    const account = await Account.findOne({ 
      _id: transaction.accountId,
      userId: req.user.id 
    });
    
    if (account) {
      if (transaction.type === 'income') {
        account.balance -= transaction.amount;
      } else {
        account.balance += transaction.amount;
      }
      await account.save();
    }

    await transaction.deleteOne();

    return res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};