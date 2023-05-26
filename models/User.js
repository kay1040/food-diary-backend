const mongoose = require('mongoose')

const { Schema } = mongoose

const userSchema = new Schema({
    email: { type: String, unique: true },
    password: String,
    userInfo: {
        gender: String,
        age: Number,
        height: Number,
        weight: Number,
        activityLevel: String
    }
}, { timestamps: true })

const User = mongoose.model('User', userSchema)
module.exports = User