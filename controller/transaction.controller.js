
const asyncHandler = require('../utils/async');
const TransactionModal = require('../schemas/transaction.model');

// @desc      Get transactions
// @route     GET /api/v1/transactions
// @access    Private
exports.getTransactions = asyncHandler(async (req, res, next) => {
    const transactions = await TransactionModal.find({user: req.user._id})
    .populate(['sender_wallet', {
        path: 'receiver_wallet',
        select: 'phone_number user'
    }])

    res.status(200).json({
        success: true,
        data: transactions
    });
});
