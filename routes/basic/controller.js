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
        const { id, pw, name, email, phone_number } = req.body
        const { address_number, roadAddress, jibunAddress, detailAddress, extraAddress } = req.body
        const address = `${address_number} ${roadAddress} ${jibunAddress} ${detailAddress} ${extraAddress}`
        const encoding_pw = crypto.encodig(pw)
        const check_id = await basic_mysql_callback.basic_GET_USER_ID(id)
        const p_num_reg = /^(\d{2,3})(\d{3,4})(\d{4})$/

        if (!id) res.write(`<script>alert('아이디를 입력해주세요');history.back();</script>`, 'utf-8')
        if (CheckArr.idEmptyArray(check_id)) {
            if (!pw) res.write(`<script>alert('비밀번호를 입력해주세요');history.back();</script>`, 'utf-8')
            if (!name) res.write(`<script>alert('닉네임을 입력해주세요');history.back();</script>`, 'utf-8')
            if (phone_number) {
                if (p_num_reg.test(phone_number)) {
                    const p_num = phone_number.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`)
                    const basic_insert_data = await basic_mysql_callback.basic_INSERT_USER_DATA(id, encoding_pw, name)
                    const extra_insert_data = await extra_mysql_callback.extra_INSERT_USER_DATA(id, email, p_num, address)
                    res.redirect('login')
                } else {
                    res.write(`<script>alert('전화번호 형식을 지켜주세요');history.back();</script>`, 'utf-8')
                }
            } else {
                const basic_insert_data = await basic_mysql_callback.basic_INSERT_USER_DATA(id, encoding_pw, name)
                const extra_insert_data = await extra_mysql_callback.extra_INSERT_USER_DATA(id, email, phone_number, address)
                res.redirect('login')
            }
        } else {
            res.write(`<script>alert('아이디가 중복되었습니다');location.href="https://jh.jp.ngrok.io/basic/reg";</script>`, 'utf-8')
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
        if (check_id[0] !== undefined) {
            const decoding_pw = crypto.decoding(check_id[0].pw)
            if (pw === decoding_pw) {
                const more_userdata = await extra_mysql_callback.extra_GET_USER_DATA(id)
                req.session.userdata = check_id[0].id
                userdata.name = check_id[0].name
                userdata.extra = more_userdata[0]
                res.render('user', { data: userdata })
            } else {
                res.write(`<script>alert('잘못된 비밀번호'); location.href="https://jh.jp.ngrok.io/basic/login";</script>`, 'utf-8')
            }
        } else {
            res.write(`<script>alert('잘못된 아이디'); location.href="https://jh.jp.ngrok.io/basic/login";</script>`, 'utf-8')
        }
    } catch (e) {
        if (e) throw e
    }
}

exports.LOGOUT_LOGIC = async (req,res) => {
    req.session.destroy(() => { })
    res.redirect('index')
}