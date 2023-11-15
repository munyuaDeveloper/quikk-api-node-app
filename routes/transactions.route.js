const express = require('express');
const router = express.Router({ mergeParams: true });

const { protect } = require('../middleware/auth');
const { getTransactions } = require('../controller/transaction.controller');

router.use(protect);

router.get('/', getTransactions)

module.exports = router;