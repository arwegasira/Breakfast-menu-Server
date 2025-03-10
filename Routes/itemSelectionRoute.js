const express = require('express')
const router = express.Router()
const { getAvailableItems } = require('../Controller/breakfastItemes')

router.get('/orderItems-selection', getAvailableItems)

module.exports = router
