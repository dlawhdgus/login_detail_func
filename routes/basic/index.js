const router = require('express').Router()
const controller = require('./controller')

router.get('/index', controller.INDEX_PAGE)

module.exports = router