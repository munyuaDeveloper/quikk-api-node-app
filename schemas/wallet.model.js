const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WalletSchema = new mongoose.Schema({
    balance: {
        type: Number,
        default: 0,
        required: true
    },
    phone_number: {
        type: String,
        unique: true,
        minLength: 10,
        maxLength: 10,
        required: [true, 'Please add a phone number']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Wallet', WalletSchema);