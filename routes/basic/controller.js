const basic_mysql_callback = require('../../models/mysql/user_info')
const extra_mysql_callback = require('../../models/mysql/more_user_info')
const CheckArr = require('../../modules/array')

exports.INDEX_PAGE = (req, res) => {
    res.render('index')
}

exports.REG_PAGE = (req, res) => {
    res.render('reg')
}

exports.REG_LOGIC = async (req, res) => {
    const { id, pw, name, email, phone_number, address } = req.body

    const check_id = await basic_mysql_callback.basic_GET_USER_ID(id)
    if(CheckArr.idEmptyArray(check_id)) {
        const basic_insert_data = await basic_mysql_callback.basic_INSERT_USER_DATA(id, pw, name)
        const extra_insert_data = await extra_mysql_callback.extra_INSERT_USER_DATA(id, email, phone_number, address)
    } else {
        res.write(`<script>alert('id가 중복되었습니다');location.href="https://jh.jp.ngrok.io/basic/reg";</script>`,'utf8')
    }
}