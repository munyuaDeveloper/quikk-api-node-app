const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    sender_wallet: {
        type: Schema.Types.ObjectId,
        ref: 'Wallet',
        required: true,
    },
    receiver_wallet: {
        type: Schema.Types.ObjectId,
        ref: 'Wallet',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Transaction', TransactionSchema);