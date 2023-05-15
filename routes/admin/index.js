const router = require('express').Router()
const controller = require('./controller')

router.get('/users',controller.LOGIN_LOGIC)

module.exports = router