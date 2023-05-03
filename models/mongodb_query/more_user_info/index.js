const mongoose = require('mongoose')
const { connection } = require('mongoose')
const more_user_info = connection.collection('more_user_info')

exports.INSERT_USER_DATA = async (userfilter) => {
    try {
        more_user_info.insertOne(userfilter)
    } catch (e) {
        if (e) throw e
    }
}