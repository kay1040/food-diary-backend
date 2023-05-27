const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI)

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Connect to MongoDB successfully!')
    } catch (error) {
        console.log('Connect failed' + error.message)
    }
}
connectDB()

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH')
    res.setHeader('Access-Control-Allow-Headers', 'Content-type, Authorization')
    next()
})

app.listen(3000, () => {
    console.log('Server is running at http://127.0.0.1:3000')
})

const userRoute = require('./routes/user')
const foodRecordRoute = require('./routes/food');

app.use('/api/user', userRoute)
app.use('/api/food', foodRecordRoute)

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Promise Rejection:')
    console.error(reason)
    process.exit(1)
})
