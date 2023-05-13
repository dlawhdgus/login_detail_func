const user_info = require('../../models/mongodb_query/user_info')
const more_user_info = require('../../models/mongodb_query/more_user_info')
const crypto = require('../../modules/crypto')
const arr = require('../../modules/chk_array')

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
        const { id, pw, name } = req.body
        let { email, phone_number } = req.body

        if (!email) email = ''
        if (!phone_number) phone_number = ''

        let { address_number, roadAddress, jibunaddress, detailAddress, extraAddress } = req.body
        const a = address_number ?? ""
        const r = roadAddress ?? ""
        const j = jibunaddress ?? ""
        const d = detailAddress ?? ""
        const e = extraAddress ?? ""
        const address = `${a} ${r} ${j} ${d} ${e}`

        const p_num_reg = /^(\d{2,3})(\d{3,4})(\d{4})$/

        const userfilter = {}
        const more_userfilter = {}

        const data = new Date()

        // 순서 -> 아이디 중복 체크 -> 비번 암호화 -> 전화번호 '-' 넣기 -> 회원가입 -> 로그인 창으로 넘어가기(로그인 안됨)
        const Check_User = await user_info.CHECK_USER_ID(id)
        if (!Check_User) {
            const encoding_pw = crypto.encoding(pw)
            userfilter.id = id
            userfilter.pw = encoding_pw
            userfilter.name = name
            userfilter.reg_date = data
            if (phone_number) {
                const Check_Phone_number = p_num_reg.test(phone_number)
                if (Check_Phone_number) {
                    const p_num = phone_number.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`)

                    more_userfilter.id = id
                    more_userfilter.email = email
                    more_userfilter.phone_number = p_num
                    more_userfilter.address = address
                    more_userfilter.flag = 'u'
                    more_userfilter.reg_date = data

                    const insert_data = await user_info.INSERT_USER_DATA(userfilter)
                    const insert_more_data = await more_user_info.INSERT_USER_DATA(more_userfilter)

                    res.redirect('login')
                } else {
                    res.write(`<script>alert('전화번호 형식이 틀렸습니다.');history.back();</script>`, "utf8")
                }
            } else {
                more_userfilter.id = id
                more_userfilter.email = email
                more_userfilter.phone_number = phone_number
                more_userfilter.address = address
                more_userfilter.flag = 'a'
                more_userfilter.reg_date = data

                const insert_data = await user_info.INSERT_USER_DATA(userfilter)
                const insert_more_data = await more_user_info.INSERT_USER_DATA(more_userfilter)

                res.redirect('login')
            }
        } else {
            res.write(`<script>alert('아이디가 중복되었습니다.');history.back();</script>`, "utf8")
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
        const userdata = await user_info.GET_USER_DATA_ID(id)
        if (userdata) {
            const decode_pw = crypto.decoding(userdata.pw)
            if (pw === decode_pw) {
                const UID = userdata._id.toString()
                req.session.UID = UID
                req.session.save(() => {
                    res.render('user', { data: userdata })
                })
            } else {
                res.write(`<script>alert('비밀번호가 일치하지 않습니다.');history.back();</script>`, 'utf8')
            }
        } else {
            res.write(`<script>alert('일치하는 아이디가 없습니다.');location.href = 'https://jh.jp.ngrok.io/basic/login';</script>`, 'utf8')
        }
    } catch (e) {
        if (e) throw e
    }
}

exports.LOGOUT_LOGIC = async (req, res) => {
    try {
        req.session.destory(() => { })
        res.redirect('index')
    } catch (e) {
        if (e) throw e
    }
}

exports.UPDATE_PAGE = async (req, res) => {
    try {
        const { UID } = req.session
        const user_data = await user_info.GET_USER_DATA_OID(UID)
        res.render('user_edit', { data : user_data })
    } catch (e) {
        if (e) throw e
    }
}