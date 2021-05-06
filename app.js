var express = require("express");
var bodyParser = require("body-parser");
var router = require("./controller/routes/router.js");
const cors = require('cors');
const expressWs = require('express-ws');
const websocket = require('./controller/routes/socket');

var app = express();
// socket
expressWs(app);

//跨域问题
app.use(cors());

//配置
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use('/',express.static('./views/'));

//挂在路由
app.use(router);

// socket部分
app.use('/ws',websocket);


app.listen(3000,function(){
    console.log("http://localhost:3000 running");
})


