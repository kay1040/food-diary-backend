const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
require('dotenv').config()

const signup = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        res.status(400).json({
            message: 'Email and password are required.'
        })
        return
    }

    let existingUser

    try {
        existingUser = await User.findOne({ email })

    } catch (error) {
        res.status(500).json({
            message: 'An error occurred.'
        })
    }

    if (existingUser) {
        res.status(409).json({
            message: 'User already exists.'
        })
        return
    }

    let hashedPassword

    try {
        hashedPassword = await bcrypt.hash(password, 10)
    } catch (error) {
        res.status(500).json({
            message: 'An error occurred.'
        })
    }

    const user = new User({
        email,
        password: hashedPassword,
    });

    try {
        await user.save();

    } catch (error) {
        res.status(500).json({
            message: 'An error occurred.'
        })
    }

    res.json({
        message: 'User added successfully!'
    })
}

// const signup = async (req, res) => {
//     const { email, password } = req.body

//     if (!email || !password) {
//         res.status(400).json({
//             message: 'Email and password are required.'
//         })
//         return
//     }

//     try {
//         const existingUser = await User.findOne({ email })

//         if (existingUser) {
//             res.status(409).json({
//                 message: 'User already exists.'
//             })
//             return
//         }

//         const hashedPassword = await bcrypt.hash(password, 10)

//         const user = new User({
//             email,
//             password: hashedPassword,
//         });

//         await user.save();

//         res.json({
//             message: 'User added successfully!'
//         })
//     } catch (error) {
//         res.status(500).json({
//             message: 'An error occurred.'
//         })
//     }
// }

const login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        res.status(400).json({
            message: 'Email and password are required.'
        });
        return
    }

    try {
        const user = await User.findOne({ email }).exec()
        if (user) {
            const isPasswordMatched = await bcrypt.compare(password, user.password)

            if (isPasswordMatched) {
                const token = jwt.sign({ email: user.email }, process.env.SECRET_KEY, { expiresIn: '3h' })
                res.json({
                    message: 'Login Successful!',
                    userId: user._id.toString(),
                    token
                });
            } else {
                res.status(401).json({
                    message: 'Invalid credentials.'
                });
            }
        } else {
            res.status(404).json({
                message: 'No user found.'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'An error occurred.',
            error: error.message
        });
    }
}

const updatePasswrod = async (req, res) => {
    try {
        const { userId, currentPassword, newPassword } = req.body

        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({ message: 'User not found.' })
        }

        const isPasswordMatch = await bcrypt.compare(currentPassword, user.password)

        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Invalid current password.' })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        user.password = hashedPassword

        await user.save()

        res.status(200).json({ message: 'Password updated successfully.' })
    } catch (error) {
        res.status(500).json({ message: 'An error occurred.', error: error.message })
    }
}

const addUserInfo = async (req, res) => {
    try {
        const { userId, gender, age, height, weight, activityLevel } = req.body
        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({ message: 'User not found.' })
        }

        user.userInfo = {
            gender,
            age,
            height,
            weight,
            activityLevel
        }

        await user.save()

        res.status(201).json({ message: 'User information added successfully.' })
    } catch (error) {
        res.status(500).json({ message: 'An error occurred.', error: error.message })
    }
}

const getUserById = async (req, res) => {
    try {
        const { userId } = req.params
        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({ message: 'User not found.' })
        }

        res.status(200).json({ user })
    } catch (error) {
        res.status(500).json({ message: 'An error occurred.', error: error.message })
    }
}

const updateUserInfoById = async (req, res) => {
    try {
        const { userId } = req.params
        const { gender, age, height, weight, activityLevel } = req.body

        const user = await User.findByIdAndUpdate(userId, {
            userInfo: {
                gender,
                age,
                height,
                weight,
                activityLevel
            }
        }, { new: true })

        res.status(200).json({ message: 'User info updated successfully.', user })
    } catch (error) {
        res.status(500).json({ message: 'An error occurred.', error: error.message })
    }
}

module.exports = {
    signup,
    login,
    updatePasswrod,
    addUserInfo,
    getUserById,
    updateUserInfoById
}