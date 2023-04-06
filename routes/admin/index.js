const router = require('express').Router()
const controller = require('./controller')

router.get('/users', controller.USERS_PAGE)
router.post('/update', controller.UPDATE_PAGE)
router.post('/update_logic', controller.UPDATE_LOGIC)
router.post('/delete_logic', controller.DELETE_LOGIC)

module.exports = router