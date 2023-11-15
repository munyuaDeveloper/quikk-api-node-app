const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/async');
const UserModel = require('../schemas/user.model');

// @desc      Get all users
// @route     GET /api/v1/users
// @access    Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

// @desc      Get single user
// @route     GET /api/v1/users/:id
// @access    Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await UserModel.findById(req.params.id);

    res.status(200).json({
        success: true,
        data: user
    });
});

// @desc      Create user
// @route     POST /api/v1/users
// @access    Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
    const user = await UserModel.create(req.body);

    res.status(201).json({
        success: true,
        data: user
    });

});

// @desc      Update user
// @route     PUT /api/v1/users/:id
// @access    Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
    const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: user
    });
});

// @desc      Delete user
// @route     DELETE /api/v1/users/:id
// @access    Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
    await UserModel.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        data: {}
    });
});