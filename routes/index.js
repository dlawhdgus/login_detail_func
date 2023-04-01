const router = require('express').Router()

const paths = [
    '/basic',
    '/admin'
]

paths.forEach(path => router.use(path, require(`.${path}`)))

module.exports = router