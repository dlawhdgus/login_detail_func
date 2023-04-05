const router = require('express').Router()
const controller = require('./controller')

router.get('/login', controller.LOGIN_LOGIC)
router.post('/update', controller.UPDATE_PAGE)
router.post('/update_logic', controller.UPDATE_LOGIC)

module.exports = router