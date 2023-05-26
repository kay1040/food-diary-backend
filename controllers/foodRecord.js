const FoodRecord = require('../models/FoodRecord')
const User = require('../models/User')

const addFoodRecord = async (req, res) => {
    try {
        const { userId, date, foods, totalCalories } = req.body
        const existingRecord = await FoodRecord.findOne({ userId, date }).exec()

        if (existingRecord) {
            existingRecord.foods.push(...foods);
            existingRecord.totalCalories += totalCalories;
            await existingRecord.save();
        } else {
            const record = new FoodRecord({
                userId,
                date,
                foods,
                totalCalories,
            });
            await record.save()
        }

        res.status(201).json({ message: 'Record created successfully.' })

    } catch (error) {
        res.status(500).json({ message: 'An error occurred.', error: error.message })
    }
}

const updateFoodRecordByRecordId = async (req, res) => {
    try {
        const { recordId } = req.params
        const { foods, totalCalories } = req.body

        const record = await FoodRecord.findById(recordId)

        if (!record) {
            return res.status(404).json({ message: 'Food record not found.' })
        }

        record.foods = foods
        record.totalCalories = totalCalories
        await record.save()

        res.status(200).json({ message: 'Food record updated successfully.' })
    } catch (error) {
        res.status(500).json({ message: 'An error occurred.', error: error.message });
    }
}

const getFoodRecordsByUserId = async (req, res) => {
    try {
      const { userId, year, month } = req.params
      const user = await User.findById(userId)
      if (!user) {
        return res.status(404).json({ message: 'User not found.' })
      }

      const startDate = new Date(year, month - 1, 1)
      const endDate = new Date(year, month, 0)
      
      const foodRecords = await FoodRecord.find({
        userId,
        date: { $gte: startDate, $lt: endDate }
      });
  
      res.status(200).json({ foodRecords })
    } catch (error) {
      res.status(500).json({ message: 'An error occurred.', error: error.message })
    }
  }

module.exports = {
    addFoodRecord,
    updateFoodRecordByRecordId,
    getFoodRecordsByUserId
}