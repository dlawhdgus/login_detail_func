const router = require('express').Router()
const controller = require('./controller')

router.get('/index', controller.INDEX_PAGE)
router.get('/reg', controller.REG_PAGE)
router.post('/reg_logic', controller.REG_LOGIC)
router.get('/login', controller.LOGIN_PAGE)
router.post('/login_logic', controller.LOGIN_LOGIC)
router.post('/logout_logic', controller.LOGOUT_LOGIC)
router.get('/update', controller.UPDATE_PAGE)
router.post('/update_logic', controller.UPDATE_LOGIC)
router.post('/delete_logic', controller.DELETE_LOGIC)

module.exports = router