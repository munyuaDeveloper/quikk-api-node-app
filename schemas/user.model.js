const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: [true, 'Please add a first name']
    },
    last_name: {
        type: String,
        required: [true, 'Please add a last name']
    },
    phone_number: {
        type: String,
        unique: true,
        minLength: 10,
        maxLength: 10,
        required: [true, 'Please add a phone number']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before save using bcryptjs
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    // const salt = await bcrypt.getSalt(10)
    this.password = await bcrypt.hash(this.password, 10)
});

// Sign JWT token
UserSchema.methods.getSignedJwtToken = function () {
    // I added the user object in the token payload
    return jsonwebtoken.sign({ id: this._id, user: { id: this._id, first_name: this.first_name, last_name: this.last_name, email: this.email, role: this.role } }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

// Compare the provided password with the encrypted password in the database
UserSchema.methods.matchPassword = async function (providedPassword) {
    return await bcrypt.compare(providedPassword, this.password);
}

module.exports = mongoose.model('User', UserSchema);