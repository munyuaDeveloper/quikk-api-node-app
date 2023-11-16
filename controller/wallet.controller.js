
const asyncHandler = require('../utils/async');
const WalletModal = require('../schemas/wallet.model');
const TransactionModal = require('../schemas/transaction.model');

// @desc      Get single wallet
// @route     GET /api/v1/wallet
// @access    Private
exports.getWallet = asyncHandler(async (req, res, next) => {
    const wallet = await WalletModal.findOne({ user: req.user._id })

    res.status(200).json({
        success: true,
        data: wallet
    });
});

// @desc      Update wallet balance
// @route     POST /api/v1/wallet/topUp
// @access    Private
exports.topUpWallet = asyncHandler(async (req, res, next) => {
    const wallet = await WalletModal.findOne({ user: req.user._id })

    let updatedWallet = null
    if (wallet) {
        updatedWallet = await WalletModal.findOneAndUpdate(
            { user: req.user._id },
            { balance: wallet.balance + +req.body.amount },
            { new: true })
    }
    await TransactionModal.create(        {
        amount: req.body.amount,
        user: req.user._id,
        type: 'topUp'
    })

    res.status(200).json({
        success: true,
        data: updatedWallet
    });
});

// @desc      send money
// @route     POST /api/v1/wallet/send-money
// @access    Private
exports.sendMoney = asyncHandler(async (req, res, next) => {
    const receiverWallet = await WalletModal.findOne({ phone_number: req.body.phone_number })
    const ownerWallet = await WalletModal.findOne({ user: req.user._id })

    let updatedOwnerWallet = null;
    if (!receiverWallet || !ownerWallet || ownerWallet.balance < req.body.amount) {
        const message = !receiverWallet ? "The receiver wallet was not found!" : "The wallet doesn't have enough balance"
        return res.status(400).json({
            success: false,
            data: message
        });
    }

    // debit the owner waller
    updatedOwnerWallet = await WalletModal.findOneAndUpdate(
        { user: req.user._id },
        { balance: ownerWallet.balance - +req.body.amount },
        { new: true })


    // credit the receiver wallet
    await WalletModal.findOneAndUpdate(
        { phone_number: req.body.phone_number },
        { balance: receiverWallet.balance + +req.body.amount },
        { new: true })

    const createTransactions  = [
        {
            amount: req.body.amount,
            user: req.user._id,
            receiver: receiverWallet.user,
            type: 'send'
        },
        {
            amount: req.body.amount,
            user: receiverWallet.user,
            sender: req.user._id,
            type: 'receive'
        }
    ]
    await TransactionModal.create(createTransactions)

    res.status(200).json({
        success: true,
        data: updatedOwnerWallet
    });
});