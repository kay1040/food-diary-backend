const express = require('express')
const router = express.Router()
const foodRecord = require('../controllers/foodRecord')
const authenticate = require('../middlewares/authenticate')

const { addFoodRecord, updateFoodRecordByRecordId, getFoodRecordsByUserId } = foodRecord

router.use(authenticate)
router.post('/', addFoodRecord)
router.put('/:recordId', updateFoodRecordByRecordId)
router.get("/:userId/:year/:month", getFoodRecordsByUserId)

module.exports = router