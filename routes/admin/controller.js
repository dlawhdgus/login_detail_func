const user_info = require('../../models/mongodb_query/user_info/admin_user')
const more_user_info = require('../../models/mongodb_query/more_user_info')
const crypto = require('../../modules/crypto')
const arr = require('../../modules/chk_array')

exports.LOGIN_LOGIC = async (req, res) => {
    let { page } = req.query
    const users_data = await user_info.GET_USERS_DATA(page)
    console.log(users_data)
    res.render('admin_users')
}