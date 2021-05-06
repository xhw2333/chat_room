var express = require("express");
var User = require("../db/user");
var { getRandomString, checkToken } = require('../utils/utils');

//创建路由容器
var router = express.Router();

// 存储用户状态token
// token失效时间 1 天=86400000 毫秒
const userState = new Map();

//处理登录请求
router.post("/login", function (req, res) {
    console.log(req.body, "login");

    // 解析post请求参数
    const body = req.body;

    //判断有无此用户
    User.findByNameAndKey(body.name, body.password).then(res1 => {
        console.log(res1);
        if (res1.length !== 0) {
            // 生成token
            const token = getRandomString();
            console.log(token);
            userState.set(token, {
                id: res1[0].id,
                name: res1[0].nickname,
                time: new Date().getTime() //登录时记录毫秒，token过期就不让其登录
            });

            //找到用户
            res.status(200).json({
                code: 1,
                msg: '登陆成功',
                data: { ...res1[0], token }
            })
        } else {
            //找不到用户
            res.status(200).json({
                code: 0,
                msg: "该用户不存在",
                data: null,
            })
        }
    }).catch(err => {
        res.status(500).json({
            code: -1,
            msg: "Server Error",
            data: null
        })
        console.log(err);
    });
});


//处理注册请求
router.post("/register", function (req, res) {
    // console.log(req.body, "register");

    const { name, password, avatar, email, gender } = req.body;

    //判断有无用户已存在
    User.findByNameAndEmail(name, email).then(res1 => {
        console.log(res1, "\n");

        if (res1.length != 0) {
            // 不能注册
            return false;
        }
        else {
            //查无数据，可以注册
            return User.addUser([
                name,
                password,
                "http://localhost:3000/img/head.jpg",
                email,
                gender || -1,
                // "1990-1-1",
                // "",
            ])
        }
    }).then(res2 => {
        console.log(res2);

        if (!res2) {
            //无法注册
            console.log("注册失败");
            res.status(200).json({
                code: 0,
                msg: '昵称或账号已存在',
                data: null
            })
        } else {
            console.log("注册成功");
            //可以注册的情况
            res.status(200).json({
                code: 1,
                msg: '注册成功',
                data: null
            })
        }

    }).catch(err => {
        console.log(err, "错误");
        res.status(500).json({
            code: -1,
            msg: 'Server Error',
            data: null,
        })
    })
})

// 获取用户列表
router.get("/user", function (req, res) {

    User.findAll().then(res1 => {
        for(let i = 0; i < res1.length; i++){
            delete res1[i].password;
        }

        res.status(200).json({
            code: 1,
            data: res1,
            msg: '获取所有用户'
        })
    }).catch(err => {
        console.log(err, "错误");
        res.status(500).json({
            code: -1,
            msg: 'Server Error',
            data: null,
        })
    })
})

// 示例
router.post("/login1", function (req, res) {

    // 获取token
    const { token } = req.headers;
    console.log(token, 'loginPOST');

    let state = checkToken(userState, token);

    if (!state) {
        return res.status(200).json({
            data: null,
            msg: '请登录！'
        })
    }

    res.status(200).json({
        data: 'GET'
    })

})


module.exports = router;