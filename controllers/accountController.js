const Account = require('../models/Account');
const { validationResult } = require('express-validator');

// Get all accounts for the logged-in user
exports.getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({ userId: req.user.id });
    return res.status(200).json({
      success: true,
      count: accounts.length,
      data: accounts
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get single account
exports.getAccount = async (req, res) => {
  try {
    const account = await Account.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!account) {
      return res.status(404).json({
        success: false,
        error: 'Account not found or not authorized'
      });
    }

    return res.status(200).json({
      success: true,
      data: account
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Add new account
exports.addAccount = async (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const newAccount = await Account.create({
      ...req.body,
      userId: req.user.id
    });

    return res.status(201).json({
      success: true,
      data: newAccount
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Update account
exports.updateAccount = async (req, res) => {
  try {
    const account = await Account.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!account) {
      return res.status(404).json({
        success: false,
        error: 'Account not found or not authorized'
      });
    }

    return res.status(200).json({
      success: true,
      data: account
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};