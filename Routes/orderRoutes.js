const express = require('express')
const router = express.Router()
const {
  createOrder,
  getAllOrder,
  getAllOrdersV2,
  getOrderById,
  updateOrder,
  mostOrderedItems,
} = require('../Controller/orderController')
router.get('/topOrderedItems', mostOrderedItems)
router.route('/').post(createOrder).get(getAllOrdersV2)
router.route('/:id').get(getOrderById).patch(updateOrder)

module.exports = router
