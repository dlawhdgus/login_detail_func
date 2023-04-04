const router = require('express').Router()
const controller = require('./controller')

router.get('/login', controller.LOGIN_LOGIC)

module.exports = router