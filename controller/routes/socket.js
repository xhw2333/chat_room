var express = require('express');
var expressWs = require('express-ws');

const { findById } = require('../db/user');

// 创建路由容器
const router = express.Router();
expressWs(router);

//记录所有登录的用户
const users = new Map();

/* 
    状态 ,type: 
    0 -- 有用户退出， 
    1 -- 有用户登录,
    2 -- 聊天信息
*/
router.ws('/users', async function (ws, req) {

    // 获取传来的参数uid
    const { uid } = req.query;

    const user = await findById(uid);

    // 登录成功，因为只有注册后才能登录，之前有判断，此处无需判断
    if (!users.has(ws)) {
        delete user[0].password;
        users.set(ws, user[0]); //存用户
    }

    broadcast({
        type: 1,
        total: users.size,
        name: users.get(ws).nickname,
        list: [...users.values()],
        msg: '用户登录'
    }, users);

    // 客户端发来信息
    ws.on('message', function (msg) {
        // console.log(msg);

        msg = JSON.parse(msg);

        const { type, data } = msg;

         // 普通对话
         broadcast({
            type: 2,
            msg: data,
            user: {
                name: users.get(ws).nickname,
                avatar: users.get(ws).avatar
            },
        }, users);


    })

    ws.on('close', function () {
        console.log('连接断开');

        const { nickname } = users.get(ws);

        //当前用户信息从users移除,删除掉离开的用户
        users.delete(ws);

        //告诉所有人，有人离开聊天室
        broadcast({
            type: 0,
            total: users.size,
            name: nickname,
            list: [...users.values()],
            msg: '用户退出'
        }, users);

    })

    ws.on('error', function (err) {
        console.log(err);
    })


});

// 向哪个websocket广播
function broadcast(msg, map) {
    for (const item of map.keys()) {
        item.send(JSON.stringify(msg))
    }
}

module.exports = router;