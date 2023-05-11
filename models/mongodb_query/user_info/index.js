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
        const cursor = user_info.aggregate([
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
        ])
        const result = await cursor.toArray()                       // 배열로 전환
        return result
    } catch (e) {
        if (e) throw e
    }
}