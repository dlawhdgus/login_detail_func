const mongoose = require('mongoose')
const { connection } = require('mongoose')
const user_info = connection.collection('user_info')
const { ObjectId } = require('mongoose').Types

exports.CHECK_USER_ID = async (id) => {
    try {
        const userdata = await user_info.findOne({ id: `${id}` })
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

exports.GET_USER_DATA_ID = async (id) => {
    try {
        const pipeline = [
            {
                $match: {
                    id: id
                }
            },
            {
                $lookup: {
                    from: "more_user_info",                         // 참조 컬랙션 이름 지정
                    let: { id: "$id" },                             // $id 뱐수 지정, id필드 사용
                    pipeline: [                                     // 추가적인 작업
                        {
                            $match: {                               // more_user_info의 $id필드와, from에서 가져온 $id가 맞는지 확인
                                $expr: { $eq: ["$id", "$$id"] }
                            }
                        },
                        {
                            $project: {                             // 출력할 필드 지정
                                _id: 0,
                                email: 1,
                                phone_number: 1,
                                address: 1,
                                flag: 1
                            }
                        }
                    ],
                    as: "more_user_info"                             // $lookup의 작업 결과를 저장할 필드 이름
                }
            },
            {
                $project: {                                         // 최종 데이터 출력 형태 정의
                    _id: 1,
                    id: 1,
                    pw: 1,
                    name: 1,
                    reg_date: 1,
                    etc: { $arrayElemAt: ["$more_user_info", 0] }
                }
            }
        ]

        const result = await user_info.aggregate(pipeline).toArray()                       // 배열로 전환
        return result[0]
    } catch (e) {
        if (e) throw e
    }
}

exports.GET_USER_DATA_OID = async (OID) => {
    try {
        const user_id = await user_info.findOne({ _id: new ObjectId(OID) },{projection : { _id : 0, id : 1 }})
        const pipeline = [
            {
                $match: {
                    id: user_id.id
                }
            },
            {
                $lookup: {
                    from: 'more_user_info',
                    let: { id: "$id" },                             // $id 뱐수 지정, id필드 사용
                    pipeline: [                                     // 추가적인 작업
                        {
                            $match: {                               // more_user_info의 $id필드와, from에서 가져온 $id가 맞는지 확인
                                $expr: { $eq: ["$id", "$$id"] }
                            }
                        },
                        {
                            $project: {                             // 출력할 필드 지정
                                _id: 0,
                                email: 1,
                                phone_number: 1,
                                address: 1,
                                flag: 1
                            }
                        }
                    ],
                    as: 'more_user_info'
                }
            },
            {
                $project: {                                         // 최종 데이터 출력 형태 정의
                    _id: 0,
                    id: 1,
                    name: 1,
                    reg_date: 1,
                    etc: { $arrayElemAt: ["$more_user_info", 0] }
                }
            }
        ]
        const cursor = await user_info.aggregate(pipeline).toArray()
        return cursor[0]
    } catch (e) {
        if (e) throw e
    }
}

exports.UPDATE_USERDATA = async (id, change_value) => {
    try {
        const update_user = await user_info.updateOne({ id : `${id}`}, { $set : change_value})
    } catch (e) {
        if (e) throw e
    }
}

exports.DELETE_USER = async (OID) => {
    try {
        const delete_user = await user_info.deleteOne({_id : new ObjectId(OID)})
        const user_id = await user_info.findOne({_id : new ObjectId(OID)},{projection : {_id : 0, id :1}})
        return user_id
    } catch (e) {
        if (e) throw e
    }
}
