const express = require('express')
const router = express.Router()

const { registerUser, verifyAccount } = require('../Controller/auth')

router.post('/register-user', registerUser)
router.patch('/verify-account', verifyAccount)

module.exports = router
