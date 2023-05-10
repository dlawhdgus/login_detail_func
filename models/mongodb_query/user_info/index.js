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

exports.GET_USER_ALL_DATA = async (id) => {
    try {
        user_info.aggregate([
            {
                $lookup: {
                    from: "more_user_info",
                    let: { id: "$id" },
                    pipeline: [
                      {
                        $match: {
                          $expr: { $eq: ["$id", "$$id"] }  //user_info_id, more_user_info_id
                        }
                      },
                      {
                        $project: {
                          _id: 0,
                          email: 1,
                          phone_number: 1,
                          address: 1,
                          flag: 1
                        }
                      }
                    ],
                    as: "more_user_info"
                }
            },
            {
                $project: {
                    _id: 0,
                    id: 1,
                    pw: 1,
                    name: 1,
                    reg_date: 1,
                    more_user_info: { $arrayElemAt: ["$more_user_info", 0] }
                  }
            }
        ])
    } catch (e) {
        if (e) throw e
    }
}