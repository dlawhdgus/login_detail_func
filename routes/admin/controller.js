const basic_mysql_callback = require('../../models/mysql/user_info')
const extra_mysql_callback = require('../../models/mysql/more_user_info')
const CheckArr = require('../../modules/array')
const crypto = require('../../modules/crypto')

exports.LOGIN_LOGIC = async (req, res) => {
    const { userdata } = req.session
    const user_flag_filter = await extra_mysql_callback.extra_GET_USER_FLAG(userdata)
    
    if(userdata) {
        if(user_flag_filter[0].flag === 'a') {
            //all_user_data send admin user page
        } else {
            res.write(`<script>alert('관리자만 접근 가능합니다'); location.href="https://jh.jp.ngrok.io/basic/index";</script>`, 'utf-8')    
        } 
    } else {
        res.write(`<script>alert('로그인 후 이용해주세요'); location.href="https://jh.jp.ngrok.io/basic/login";</script>`, 'utf-8')
    }
}