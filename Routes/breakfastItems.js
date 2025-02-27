const express = require('express')
const router = express.Router()
const {
  addItem,
  editItem,
  getItems,
  getAllItems,
  getAvailableItems,
} = require('../Controller/breakfastItemes')
router.route('/').get(getAllItems).post(addItem)
router.patch('/:id', editItem)
router.get('/availableItems', getAvailableItems)

module.exports = router
