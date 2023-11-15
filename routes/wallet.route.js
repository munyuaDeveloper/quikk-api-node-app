const express = require('express');
const router = express.Router({ mergeParams: true });

const { protect } = require('../middleware/auth');
const { getWallet, topUpWallet, sendMoney } = require('../controller/wallet.controller');

router.use(protect);

router.get('/', getWallet)
router.post('/topUp', topUpWallet)
router.post('/send-money', sendMoney)

module.exports = router;