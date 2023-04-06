const mysql = require('../../dbs/mysql')
const table_name = "user_info"
const extra_table = "more_user_info"
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

exports.basic_GET_USER_IDX = async (id) => {
    try {
        const sql = `SELECT idx FROM ${table_name} WHERE id = '${id}'`
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

exports.basic_UDATE_USER_NAME = async (idx, name) => {
    try {
        const sql = `UPDATE ${table_name} SET name = '${name}' WHERE idx = '${idx}'`
        mysql.query(sql, (e) => {
            if (e) throw e
        })
    } catch (e) {
        if (e) throw e
    }
}

exports.basic_DELETE_USER = async (idx) => {
    try {
        const sql = `DELETE FROM ${table_name} WHERE idx='${idx}'`
        mysql.query(sql, (e) => {
            if (e) throw e
        })
    } catch (e) {
        if (e) throw e
    }
}

exports.basic_GET_ALL_USER_DATA = async () => {
    try {
        const sql = `SELECT name FROM ${table_name}`
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

exports.join_GET_USER_DATA = async (page, pageSize) => {
    try {
        const sql = `SELECT * FROM ${table_name} INNER JOIN ${extra_table} ON ${table_name}.id = ${extra_table}.id WHERE flag = 'u' LIMIT ${page}, ${pageSize}`
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

exports.GET_USERS_COUNT = async () => {
    try {
        const sql = `SELECT COUNT(*) as cnt FROM ${table_name}`
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