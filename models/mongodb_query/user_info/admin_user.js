const mongoose = require('mongoose')
const { connection } = require('mongoose')
const user_info = connection.collection('user_info')
const { ObjectId } = require('mongoose').Types

exports.GET_USERS_DATA = async (page) => {
    try {
        const users_data = user_info.aggregate([
            {
              $lookup: {
                from: "more_user_info",
                localField: "id",                   //primary key
                foreignField: "id",                 //foreign key
                as: "more_user_info"
              }
            },
            {
              $project: {
                _id: 1,
                id: 1,
                pw: 1,
                name: 1,
                reg_date: 1,
                etc: { $arrayElemAt: ["$more_user_info", 0] }
              }
            },
            {
                $match: {
                    "etc.flag" : "u"
                }
            },
            {$sort: { reg_date: 1} },
            {$skip: (page-1) * 5},
            {$limit: 5}
        ])
        const result = users_data.toArray()
        return result
    } catch (e) {
        if (e) throw e
    }
}

exports.GET_USER_CNT = async () => {
    try {
        const cnt = await user_info.countDocuments()
        return cnt
    } catch (e) {
        if (e) throw e
    }
}

exports.DELETE_USER = async (id) => {
    try {
        const delete_user = await user_info.deleteOne({id : id})
    } catch (e) {
        if (e) throw e
    }
}