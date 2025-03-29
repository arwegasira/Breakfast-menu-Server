const express = require('express')
const router = express.Router()
const {
  createOrder,
  getAllOrder,
  getAllOrdersV2,
  getOrderById,
  updateOrder,
} = require('../Controller/orderController')
router.route('/').post(createOrder).get(getAllOrdersV2)
router.route('/:id').get(getOrderById).patch(updateOrder)

module.exports = router
