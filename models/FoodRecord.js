const mongoose = require('mongoose')

const { Schema } = mongoose

const foodRecordSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // 將用戶 ID 關聯到 User 模型
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    foods: [
        {
            id: {
                type: String,
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            calories: {
                type: Number,
                required: true,
            },
        },
    ],
    totalCalories: {
        type: Number,
        required: true,
    },
})

const FoodRecord = mongoose.model('FoodRecord', foodRecordSchema)

module.exports = FoodRecord