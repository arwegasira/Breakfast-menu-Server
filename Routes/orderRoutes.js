const express = require('express')
const router = express.Router()
const { createOrder, getAllOrder } = require('../Controller/orderController')
router.route('/').post(createOrder).get(getAllOrder)

module.exports = router
