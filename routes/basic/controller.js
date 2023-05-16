const user_info = require('../../models/mongodb_query/user_info')
const more_user_info = require('../../models/mongodb_query/more_user_info')
const crypto = require('../../modules/crypto')
const arr = require('../../modules/chk_array')
const AdminCall = require('../admin/controller')

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

        const change_value = {}
        const more_change_value = {}

        const data = new Date()

        // 순서 -> 아이디 중복 체크 -> 비번 암호화 -> 전화번호 '-' 넣기 -> 회원가입 -> 로그인 창으로 넘어가기(로그인 안됨)
        const Check_User = await user_info.CHECK_USER_ID(id)
        if(!id && !pw) {
            res.write(`<script>alert('아이디와 패스워드를 입력해주세요.');history.back();</script>`, "utf8")
        } else {

            if (!Check_User) {
                const encoding_pw = crypto.encoding(pw)
                change_value.id = id
                change_value.pw = encoding_pw
                change_value.name = name
                change_value.reg_date = data
                if (phone_number) {
                    const Check_Phone_number = p_num_reg.test(phone_number)
                    if (Check_Phone_number) {
                        const p_num = phone_number.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`)
    
                        more_change_value.id = id
                        more_change_value.email = email
                        more_change_value.phone_number = p_num
                        more_change_value.address = address
                        more_change_value.flag = 'u'
                        more_change_value.reg_date = data
    
                        const insert_data = await user_info.INSERT_USER_DATA(change_value)
                        const insert_more_data = await more_user_info.INSERT_USER_DATA(more_change_value)
    
                        res.redirect('login')
                    } else {
                        res.write(`<script>alert('전화번호 형식이 틀렸습니다.');history.back();</script>`, "utf8")
                    }
                } else {
                    more_change_value.id = id
                    more_change_value.email = email
                    more_change_value.phone_number = phone_number
                    more_change_value.address = address
                    more_change_value.flag = 'u'
                    more_change_value.reg_date = data
    
                    const insert_data = await user_info.INSERT_USER_DATA(change_value)
                    const insert_more_data = await more_user_info.INSERT_USER_DATA(more_change_value)
    
                    res.redirect('login')
                }
            } else {
                res.write(`<script>alert('아이디가 중복되었습니다.');history.back();</script>`, "utf8")
            }
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
                if (userdata.etc.flag === 'a') {
                    const UID = userdata._id.toString()
                    req.session.UID = UID
                    req.session.save(() => {
                        res.redirect('https://jh.jp.ngrok.io/admin/users?page=1')
                    })
                } else {
                    const UID = userdata._id.toString()
                    req.session.UID = UID
                    req.session.save(() => {
                        res.render('user', { data: userdata })
                    })
                }
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
        req.session.destroy(() => { })
        res.redirect('index')
    } catch (e) {
        if (e) throw e
    }
}

exports.UPDATE_PAGE = async (req, res) => {
    try {
        const { UID } = req.session
        if (!UID) {
            res.write(`<script>alert('로그인 후 사용해주세요.');location.href = 'https://jh.jp.ngrok.io/basic/login';</script>`, 'utf8')
        } else {
            const user_data = await user_info.GET_USER_DATA_OID(UID)
            res.render('user_edit', { data: user_data })
        }
    } catch (e) {
        if (e) throw e
    }
}

exports.UPDATE_LOGIC = async (req, res) => {
    try {
        const { id, name, email, phone_number, address } = req.body
        const p_num_reg = /^(\d{2,3})(\d{3,4})(\d{4})$/
        const change_value = {}
        const more_change_value = {}
        const date = new Date()
        const { UID } = req.session
        if (name) {
            change_value.name = name
            if (phone_number) {
                const p_num = phone_number.replace(p_num_reg, `$1-$2-$3`)
                more_change_value.email = email
                more_change_value.phone_number = p_num
                more_change_value.address = address
                more_change_value.reg_date = date

                const userdata_insert = await user_info.UPDATE_USERDATA(id, change_value)
                const more_data_insert = await more_user_info.UPDATE_USERDATA(id, more_change_value)

                const user_data = await user_info.GET_USER_DATA_OID(UID)
                res.render('user', { data: user_data })
            } else {
                more_change_value.email = email
                more_change_value.phone_number = phone_number
                more_change_value.address = address
                more_change_value.reg_date = date

                const userdata_insert = await user_info.UPDATE_USERDATA(id, change_value)
                const more_data_insert = await more_user_info.UPDATE_USERDATA(id, more_change_value)

                const user_data = await user_info.GET_USER_DATA_OID(UID)
                res.render('user', { data: user_data })
            }
        } else {
            res.write(`<script>alert('이름을 입력해주세요.');location.href = 'https://jh.jp.ngrok.io/basic/login';</script>`, 'utf8')
        }
    } catch (e) {
        if (e) throw e
    }
}

exports.DELETE_LOGIC = async (req, res) => {
    const { UID } = req.session
    const delete_user = await user_info.DELETE_USER(UID)
    const delete_user_more_data = await more_user_info.DELETE_USER(delete_user)
    res.redirect('index')
}