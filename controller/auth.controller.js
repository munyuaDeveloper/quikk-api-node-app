const UserModel = require('../schemas/user.model')
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../utils/async");

// @Desc Register User
// @route POST api/v1/auth/register
// @access Public
exports.register = asyncHandler(async (req, res, next) => {
    const { first_name, last_name, email, password, role } = req.body;
    const user = await UserModel.create({
        first_name,
        last_name,
        email,
        password,
        role
    });

    sendTokenResponse(user, 200, res);
});


// @Desc Login User
// @route POST api/v1/auth/login
// @access Public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        return next(new ErrorResponse(`Please provide email and password`, 400));
    }

    // Check if user exists
    const user = await UserModel.findOne({ email }).select('+password');
    if (!user) {
        return next(new ErrorResponse(`Invalid credentials`, 401));
    }

    // Compare the password and check if match
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorResponse(`Invalid credentials`, 401));
    }

    sendTokenResponse(user, 200, res);
});

// @Desc Get logged in user through token
// @route POST api/v1/auth/me
// @access Private
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await UserModel.findById(req.user.id);
    res.status(200).json({
        success: true,
        data: user
    })
})

// @desc      Update user details
// @route     PUT /api/v1/auth/updatedetails
// @access    Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email,
    };

    const user = await UserModel.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        data: user,
    });
});

// @desc      Update password
// @route     PUT /api/v1/auth/updatepassword
// @access    Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
    const user = await UserModel.findById(req.user.id).select('+password');

    // Check current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
        return next(new ErrorResponse('Password is incorrect', 401));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
});