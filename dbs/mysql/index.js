const mysql = require('mysql2')
const config = require('../../config.json')
const connection = mysql.createConnection(config.mysql)

connection.connect((e) => {
    if(e) console.log(e)
    else console.log('Mysql Connected!!')
})

module.exports = connection