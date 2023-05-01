const router = require('express').Router()
const controller = require('./controller')

router.get('/index', controller.INDEX_PAGE)
router.get('/reg', controller.REG_PAGE)
router.post('/reg_logic', controller.REG_LOGIC)
router.get('/login', controller.LOGIN_PAGE)

module.exports = router