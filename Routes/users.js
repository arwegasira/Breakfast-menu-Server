const express = require('express')
const router = express.Router()
const { fetchUsers } = require('../Controller/users')
router.get('/', fetchUsers)

module.exports = router
