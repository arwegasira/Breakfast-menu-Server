const express = require('express')
router = express.Router()

const { getRoom } = require('../Controller/roomsController')

router.get('/homeRoom-selection', getRoom)

module.exports = router
