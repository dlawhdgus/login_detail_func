const admin_user_info = require('../../models/mongodb_query/user_info/admin_user')
const user_info = require('../../models/mongodb_query/user_info')
const more_user_info = require('../../models/mongodb_query/more_user_info')
const crypto = require('../../modules/crypto')
const arr = require('../../modules/chk_array')

exports.LOGIN_LOGIC = async (req, res) => {
    let { page } = req.query
    const users_data = await admin_user_info.GET_USERS_DATA(page)
    const cnt = await admin_user_info.GET_USER_CNT()
    const count = Math.ceil((cnt - 1) / 5)
    res.render('admin_users', {
        data: users_data,
        page: count
    })
}

exports.UPDATE_PAGE = async (req, res) => {
    const { id } = req.body
    const userdata = await user_info.GET_USER_DATA_ID(id)
    res.render('admin_user_edit', { data: userdata })
}

exports.UPDATE_LOGIC = async (req, res) => {
    const { id, name, email, phone_number, address } = req.body
    const p_num_reg = /^(\d{2,3})(\d{3,4})(\d{4})$/
    const change_value = {}
    const more_change_value = {}
    const date = new Date()
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

            res.redirect('https://jh.jp.ngrok.io/admin/users?page=1')
        } else {
            more_change_value.email = email
            more_change_value.phone_number = phone_number
            more_change_value.address = address
            more_change_value.reg_date = date

            const userdata_insert = await user_info.UPDATE_USERDATA(id, change_value)
            const more_data_insert = await more_user_info.UPDATE_USERDATA(id, more_change_value)

            res.redirect('https://jh.jp.ngrok.io/admin/users?page=1')
        }
    } else {
        res.write(`<script>alert('이름을 입력해주세요.');location.href = 'https://jh.jp.ngrok.io/basic/login';</script>`, 'utf8')
    }
}

exports.DELETE_LOGIC = async (req, res) => {
    const { id } = req.body
    const delete_user = await admin_user_info.DELETE_USER(id)
    res.redirect('https://jh.jp.ngrok.io/admin/users?page=1')
}