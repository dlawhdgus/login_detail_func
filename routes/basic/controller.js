const mongodb_callback = require('../../models/mongodb_query')

exports.INDEX_PAGE = (req, res) => {
    try {
        res.render('index')
    } catch (e) {
        if (e) throw e
    }
}