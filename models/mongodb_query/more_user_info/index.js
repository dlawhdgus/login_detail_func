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

exports.GET_USER_DATA = async (id) => {
    try {
        const userdata = await more_user_info.findOne({ id : `${id}`})
        return userdata
    } catch (e) {
        if (e) throw e
    }
}

exports.UPDATE_USERDATA = async (id, change_value) => {
    const update_user = await more_user_info.updateOne({ id : `${id}`}, { $set : change_value})
}

exports.DELETE_USER = async (user_id) => {
    try {
        
        const id = user_id.id
        const delete_user = await more_user_info.deleteOne({id : id})
    } catch (e) {
        if (e) throw e
    }
}