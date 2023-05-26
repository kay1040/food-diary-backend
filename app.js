const express = require('express')
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/my-db')

const db = mongoose.connection

db.on('error', (err) => {
    console.log(err)
})

db.once('open', () => {
    console.log('Database connection established!')
})

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
});

const userRoute = require('./routes/user')
const foodRecordRoute = require('./routes/food')

app.use('/api/user', userRoute)
app.use('/api/food', foodRecordRoute)