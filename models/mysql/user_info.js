const mysql = require('../../dbs/mysql')
const table_name = "user_info"
const now_date = Date()

exports.basic_GET_USER_ID = async (id) => {
    try {
        const sql = `SELECT id FROM ${table_name} WHERE id = '${id}'`
        const result = await new Promise((resolve, reject) => {
            mysql.query(sql, (e, r) => {
                if (e) reject(e)
                else resolve(r)
            })
        })
        return result
    } catch (e) {
        if (e) throw e
    }
}

exports.basic_INSERT_USER_DATA = async (id, pw, name) => {
    try {
        const sql = `INSERT INTO ${table_name} (id, pw, name, reg_date) VALUES ('${id}', '${pw}', '${name}','${now_date}')`
        mysql.query(sql, (e) => {
            if (e) throw e
        })
    } catch (e) {
        if (e) throw e
    }
}

exports.basic_GET_USER_DATA = async (id) => {
    try {
        const sql = `SELECT * FROM ${table_name} WHERE id = '${id}'`
        const result = new Promise((resolve, reject) => {
            mysql.query(sql, (e, r) => {
                if (e) reject(e)
                else resolve(r)
            })
        })
        return result
    } catch (e) {
        if (e) throw e
    }
}