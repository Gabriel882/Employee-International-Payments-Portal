// routes/employeeRoutes.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const authenticate = require('../middleware/authenticate');  // JWT auth middleware
const authorizeEmployee = require('../middleware/authorizeEmployee'); // Check role === employee

const paymentValidationRules = [
  body('recipientAccount')
    .matches(/^\d{10}$/)
    .withMessage('Recipient account must be exactly 10 digits'),
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number'),
  body('currency')
    .isIn(['USD', 'EUR', 'GBP', 'ZAR'])
    .withMessage('Currency must be a valid type'),
  body('description')
    .optional()
    .matches(/^[A-Za-z0-9\s\-\.,]{0,100}$/)
    .withMessage('Description contains invalid characters'),
];

router.post(
  '/payments',
  authenticate,
  authorizeEmployee,
  paymentValidationRules,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    employeeController.submitPayment(req, res);
  }
);

module.exports = router;
