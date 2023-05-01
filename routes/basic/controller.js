const mongodb_callback = require('../../models/mongodb_query')
const crypto           = require('../../modules/crypto')

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
        const { id, pw, name }     = req.body
        let { email, phone_number} = req.body

        if(!email) email = ''
        if(!phone_number) phone_number = ''

        let { address_number, roadAddress, jibunaddress, detailAddress, extraAddress} = req.body
        const a = address_number ?? ""
        const r = roadAddress    ?? ""
        const j = jibunaddress   ?? ""
        const d = detailAddress  ?? ""
        const e = extraAddress   ?? ""
        const address = `${a} ${r} ${j} ${d} ${e}`

        const p_num_reg = /^(\d{2,3})(\d{3,4})(\d{4})$/

        // 순서 -> 아이디 중복 체크 -> 비번 암호화 -> 전화번호 '-' 넣기 -> 회원가입 -> 로그인 창으로 넘어가기(로그인 안됨)
        const Check_User = await mongodb_callback.CHECK_USER_ID(id)
        if(!Check_User) {
            const encoding_pw = crypto.encoding(pw)
            if(phone_number) {
                const Check_Phone_number = p_num_reg.test(phone_number)
                if(Check_Phone_number) {
                    const p_num = phone_number.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`)
                    //insert
                } else {
                    //전화번호 형식 맞춤 에러 코드
                }
            } else {
                // 전화번호 없이 insert 
            }
        } else {
            //아이디 중복 에러 코드
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