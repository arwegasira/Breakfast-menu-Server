const express = require('express')
const router = express.Router()
const {
  createOrder,
  getAllOrder,
  getAllOrdersV2,
  getOrderById,
} = require('../Controller/orderController')
router.route('/').post(createOrder).get(getAllOrdersV2)
router.get('/:id', getOrderById)

module.exports = router
