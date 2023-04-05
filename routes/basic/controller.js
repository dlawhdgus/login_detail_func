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
        const { id, pw, name } = req.body
        let { email, phone_number } = req.body
        let { address_number, roadAddress, jibunAddress, detailAddress, extraAddress } = req.body
        let address = `${address_number}${roadAddress}${jibunAddress}${detailAddress}${extraAddress}`
        
        if(!email) email = ''
        if(!phone_number) phone_number = ''
        if(address === 'undefined') address = ''
        
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

exports.LOGIN_PAGE = async (req, res) => {
    try {
        const { userdata } = req.session
        if (userdata) {
            const check_id = await basic_mysql_callback.basic_GET_USER_DATA(userdata)
            const more_userdata = await extra_mysql_callback.extra_GET_USER_DATA(userdata)
            const user_data = {}
            user_data.name = check_id[0].name
            user_data.extra = more_userdata[0]
            res.render('user', { data: user_data })
        } else {
            res.render('login')
        }
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
                res.write(`<script>alert('잘못된 비밀번호'); history.back();</script>`, 'utf-8')
            }
        } else {
            res.write(`<script>alert('잘못된 아이디'); location.href="https://jh.jp.ngrok.io/basic/login";</script>`, 'utf-8')
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
        const { userdata } = req.session
        if(userdata) {
            const user_data = {}
            const basic_userdata = await basic_mysql_callback.basic_GET_USER_DATA(userdata)
            const extra_userdata = await extra_mysql_callback.extra_GET_USER_DATA(userdata)
        
            user_data.name = basic_userdata[0].name
            user_data.extra = extra_userdata[0]
        
            res.render('user_edit', { data: user_data })
        } else {
            res.write(`<script>alert('로그인 후 이용해 주세요'); location.href="https://jh.jp.ngrok.io/basic/login";</script>`, 'utf-8')
        }
    } catch (e) {
        if (e) throw e
    }
}

exports.UPDATE_LOGIC = async (req, res) => {
    try {
        const { id, name, email, phone_num, address } = req.body

        const baisc_user_idx = await basic_mysql_callback.basic_GET_USER_IDX(id)
        const extra_user_idx = await extra_mysql_callback.extra_GET_USER_IDX(id)
    
        const update_user_name = await basic_mysql_callback.basic_UDATE_USER_NAME(baisc_user_idx[0].idx, name)
        const update_user_data = await extra_mysql_callback.extra_UPDATE_USER_DATA(extra_user_idx[0].idx, email, phone_num, address)
        const userdata = {}
    
        const user_name = await basic_mysql_callback.basic_GET_USER_DATA(id)
        const more_userdata = await extra_mysql_callback.extra_GET_USER_DATA(id)
    
        userdata.name = user_name[0].name
        userdata.extra = more_userdata[0]
        res.render('user', { data: userdata })
    } catch (e) {
        if (e) throw e
    }
}

exports.DELETE_LOGIC = async (req, res) => {
    try {
        const { id } = req.body
    
        const baisc_user_idx = await basic_mysql_callback.basic_GET_USER_IDX(id)
        const extra_user_idx = await extra_mysql_callback.extra_GET_USER_IDX(id)
    
        const basic_delete_user = await basic_mysql_callback.basic_DELETE_USER(baisc_user_idx[0].idx)
        const extra_delete_user = await extra_mysql_callback.extra_DELETE_USER(extra_user_idx[0].idx)
    
        req.session.destroy(() => { })
        res.redirect('index')   
    } catch (e) {
        if (e) throw e 
    }
}