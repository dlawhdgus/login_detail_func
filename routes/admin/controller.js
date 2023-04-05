const basic_mysql_callback = require('../../models/mysql/user_info')
const extra_mysql_callback = require('../../models/mysql/more_user_info')
const CheckArr = require('../../modules/array')
const crypto = require('../../modules/crypto')

exports.LOGIN_LOGIC = async (req, res) => {
    try {
        const { userdata } = req.session
        const user_flag_filter = await extra_mysql_callback.extra_GET_USER_FLAG(userdata)

        if (userdata) {
            if (user_flag_filter[0].flag === 'a') {
                const users_all_data = await basic_mysql_callback.join_GET_USER_DATA() //table join
                res.render('admin_users', { data: users_all_data })
            } else {
                res.write(`<script>alert('관리자만 접근 가능합니다'); location.href="https://jh.jp.ngrok.io/basic/index";</script>`, 'utf-8')
            }
        } else {
            res.write(`<script>alert('로그인 후 이용해주세요'); location.href="https://jh.jp.ngrok.io/basic/login";</script>`, 'utf-8')
        }
    } catch (e) {
        if (e) throw e
    }
}

exports.UPDATE_PAGE = async (req, res) => {
    try {
        const { id } = req.body
        const user_data = {}
        const basic_userdata = await basic_mysql_callback.basic_GET_USER_DATA(id)
        const extra_userdata = await extra_mysql_callback.extra_GET_USER_DATA(id)

        user_data.name = basic_userdata[0].name
        user_data.extra = extra_userdata[0]

        res.render('admin_user_edit', { data: user_data })
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

        const user_all_data = await basic_mysql_callback.join_GET_USER_DATA()

        res.render('admin_users', { data: user_all_data })
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

        const user_all_data = await basic_mysql_callback.join_GET_USER_DATA()

        res.render('admin_users', { data: user_all_data })
    } catch (e) {
        if (e) throw e
    }
}