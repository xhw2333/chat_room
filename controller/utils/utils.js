/* 
    封装一些公共方法
 */
function formatDate(date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    return y + '-' + m + '-' + d;
};

// 生成随机字符串
function getRandomString(num = 20) {
    const ch = '0123456789abcdefghijklmnopqrstuvwxyz';
    // const num = 20;

    let str = '';
    for (let i = 0; i < num; i++) {
        str += ch[Math.ceil(Math.random() * 36)];
    }

    return str;
}



const SUCCESS = true, ERROR = false, OVER = false;
/**
 * @description: 检查token状态
 * @param {*} tokens
 * @param {*} token
 * @return {*} ERROR -- 无token, SUCCESS -- 有此token, OVER -- token过期（1天）
 */
function checkToken(tokens, token) {
    if (!tokens.has(token)) {
        return ERROR;
    }

    // token 过期
    const { time } = tokens.get(token);
    if ((time - new Date().getTime()) >= 86400000) {
        tokens.delete(token);
        return OVER;
    };


    return SUCCESS;
}

module.exports = {
    formatDate,
    getRandomString,
    checkToken
}