const express = require('express')
const router = express.Router()
const { getAvailableItems } = require('../Controller/breakfastItemes')
const { createOrder } = require('../Controller/orderController')

router.get('/orderItems-selection', getAvailableItems)
router.post('/create-order', createOrder)

module.exports = router
