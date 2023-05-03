const mongoose = require('mongoose')
const { connection } = require('mongoose')
const user_info = connection.collection('user_info')

exports.CHECK_USER_ID = async (id) => {
    try {
        const userdata = await user_info.findOne({id : `${id}`})
        return userdata
    } catch (e) {
        if (e) throw e
    }
}

exports.INSERT_USER_DATA = async (userfilter) => {
    try {
        user_info.insertOne(userfilter)
    } catch (e) {
        if (e) throw e
    }
}