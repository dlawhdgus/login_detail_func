const mysql = require('../../dbs/mysql')
const table_name = "more_user_info"
const now_date = Date()

exports.extra_INSERT_USER_DATA = async (id, email, phone_number, address) => {
    try {
        const sql = `INSERT INTO ${table_name} (id, email, phone_num, address, reg_date, flag) VALUES ('${id}','${email}', '${phone_number}', '${address}', '${now_date}', 'a')`
        mysql.query(sql, (e) => {
            if (e) throw e
        })
    } catch (e) {
        if (e) throw e
    }
}

exports.extra_GET_USER_DATA = async (id) => {
    try {
        const sql = `SELECT * FROM ${table_name}`
        const result = new Promise((resolve, reject) => {
            mysql.query(sql, (e, r) => {
                if(e) reject(e)
                else resolve(r)
            })
        })
        return result
    } catch (e) {

    }
}