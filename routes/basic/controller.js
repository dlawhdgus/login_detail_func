const mysql_callback = require('../../models/mysql/user_info')

exports.INDEX_PAGE = (req, res) => {
    res.render('index')
}