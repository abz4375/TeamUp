/*
const asyncHandler = require ('express-async-handler')

const User = require('../models/userModel')

// @desc Get Users
// @route GET /api/users
// @access Private
export const getUsers = asyncHandler(async(req: any, res: any) => {
    const users = await User.find()

    res.status(200).json(users)
})

// @desc Set User
// @route POST /api/users
// @access Private
export const setUser = asyncHandler(async(req: any, res: any) => {
    const user = await User.create(req.body)

    res.status(200).json(user)
})

// @desc Delete User
// @route DELETE /api/users/:id
// @access Private
export const deleteUser = asyncHandler(async(req: any, res: any) => {
    res.status(200).json({ message: `Delete user ${req.params.id}` })
})


// module.exports = {
//     getUsers,
//     setUser,
//     deleteUser
// }

*/