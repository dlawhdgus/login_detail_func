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