const mysql = require('../../dbs/mysql')
const table_name = "more_user_info"
const now_date = Date()

exports.extra_INSERT_USER_DATA = async (id, email, phone_number, address) => {
    try {
        // console.log(`email : ${email} p : ${phone_number}  a : ${address}`)
        const sql = `INSERT INTO ${table_name} (id, email, phone_num, address, reg_date, flag) VALUES ('${id}','${email}', '${phone_number}', '${address}', '${now_date}', 'u')`
        mysql.query(sql, (e) => {
            if (e) throw e
        })
    } catch (e) {
        if (e) throw e
    }
}

exports.extra_GET_USER_DATA = async (id) => {
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

exports.extra_GET_USER_IDX = async (id) => {
    try {
        const sql = `SELECT idx FROM ${table_name} WHERE id='${id}'`
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

exports.extra_UPDATE_USER_DATA = async (idx, email, phone_num, address) => {
    try {
        const sql = `UPDATE ${table_name} SET email = '${email}', phone_num = '${phone_num}', address = '${address}' WHERE idx = '${idx}'`
        mysql.query(sql, (e) => {
            if (e) throw e
        })
    } catch (e) {
        if (e) throw e
    }
}

exports.extra_DELETE_USER = async (idx) => {
    try {
        const sql = `DELETE FROM ${table_name} WHERE idx='${idx}'`
        mysql.query(sql, (e) => {
            if (e) throw e
        })
    } catch (e) {
        if (e) throw e
    }
}

exports.extra_GET_USER_FLAG = async (id) => {
    try {
        const sql = `SELECT flag FROM ${table_name} WHERE id='${id}'`
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

exports.extra_GET_ALL_USER_DATA = async () => {
    try {
        const sql = `SELECT * FROM ${table_name}`
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