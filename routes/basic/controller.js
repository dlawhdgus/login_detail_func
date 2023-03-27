const basic_mysql_callback = require('../../models/mysql/user_info')
const extra_mysql_callback = require('../../models/mysql/more_user_info')
const CheckArr = require('../../modules/array')
const crypto = require('../../modules/crypto')

exports.INDEX_PAGE = (req, res) => {
    try {
        res.render('index')
    } catch (e) {
        if (e) throw e
    }
}

exports.REG_PAGE = (req, res) => {
    try {
        res.render('reg')
    } catch (e) {
        if (e) throw e
    }
}

exports.REG_LOGIC = async (req, res) => {
    try {
        const { id, pw, name, email, phone_number, address } = req.body
        const encoding_pw = crypto.encodig(pw)
        const check_id = await basic_mysql_callback.basic_GET_USER_ID(id)

        if (CheckArr.idEmptyArray(check_id)) {
            const basic_insert_data = await basic_mysql_callback.basic_INSERT_USER_DATA(id, encoding_pw, name)
            const extra_insert_data = await extra_mysql_callback.extra_INSERT_USER_DATA(id, email, phone_number, address)
        } else {
            res.write(`<script>alert('id가 중복되었습니다');location.href="https://jh.jp.ngrok.io/basic/reg";</script>`, 'utf-8')
        }
    } catch (e) {
        if (e) throw e
    }
}

exports.LOGIN_PAGE = (req, res) => {
    try {
        res.render('login')
    } catch (e) {
        if (e) throw e
    }
}

exports.LOGIN_LOGIC = async (req, res) => {
    try {
        const { id, pw } = req.body
        const check_id = await basic_mysql_callback.basic_GET_USER_DATA(id)
        const userdata = {}
        if(check_id[0] !== undefined) {
            const decoding_pw = crypto.decoding(check_id[0].pw)
            if(pw === decoding_pw) {
                const more_userdata = await extra_mysql_callback.extra_GET_USER_DATA(id)
                userdata.name = check_id[0].name
                userdata.extra = more_userdata[0]

                res.render('user', { data : userdata })
            } else {
                res.write(`<script>alert('잘못된 비밀번호'); location.href="https://jh.jp.ngrok.io/basic/login";</script>`, 'utf-8')
            }
        } else {
            res.write(`<script>alert('잘못된 아이디'); location.href="https://jh.jp.ngrok.io/basic/login";</script>`, 'utf-8')
        }
        // const userdata = {}
        // if (CheckArr.idEmptyArray(check_id)) {
        //     if (pw === decoding_pw) {
        //         const more_userdata = await extra_mysql_callback.extra_GET_USER_DATA(id)

        //         req.session.userdata = check_id[0].id

        //         userdata.name  = check_id[0].name
        //         userdata.more_data = more_userdata
                
        //         res.redirect('user', { data : userdata })
        //     } else {
        //         res.write(`<script>alert('잘못된 비밀번호'); location.href="https://jh.jp.ngrok.io/basic/login";</script>`, 'utf-8')
        //     }
        // } else {
        //     res.write(`<script>alert('잘못된 아이디'); location.href="https://jh.jp.ngrok.io/basic/login";</script>`, 'utf-8')
        // }
    } catch (e) {
        if (e) throw e
    }
}