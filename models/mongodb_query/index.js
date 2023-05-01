const mongoose = require('mongoose')
const { connection } = require('mongoose')
const basic_info = connection.collection('basic_user_info')

exports.CHECK_USER_ID = async (id) => {
    const userdata = await basic_info.findOne({id : `${id}`})
    return userdata
}