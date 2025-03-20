const express = require('express')
const router = express.Router()
const {
  createOrder,
  getAllOrder,
  getAllOrdersV2,
} = require('../Controller/orderController')
router.route('/').post(createOrder).get(getAllOrdersV2)

module.exports = router
