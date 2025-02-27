const express = require('express')
router = express.Router()

const {
  addRoom,
  editRoom,
  getRoom,
  deleteRoom,
} = require('../Controller/roomsController')

router.route('/').post(addRoom).get(getRoom)
router.route('/:id').patch(editRoom).delete(deleteRoom)

module.exports = router
