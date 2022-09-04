/* 
    操作user数据库的方法
 */

var mysql = require('mysql');

//创建连接
var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'space'
});

con.connect();

//查询所有用户
function findAll() {
    return new Promise((resolve, reject) => {
        con.query('SELECT * FROM user', function (err, res) {
            if (err) reject(err);
            else resolve(res);
        });
    })
}


//查找特定用户 根据名字和密码
function findByNameAndKey(name,password) {
    return new Promise((resolve, reject) => {
        // const sql = `SELECT * from user WHERE nickname='${name}' AND password='${password}'`;
        const sql = `SELECT * from user WHERE nickname=? AND password=?`
        con.query(sql,[name,password], function (err, res) {
            if (err) reject(err);
            else resolve(res);
        })
    })
}


//查找特定用户 根据邮箱 
function findByNameAndEmail(name,email) {
    return new Promise((resolve, reject) => {
        // test
        con.query(`SELECT * from user WHERE nickname='${name}' OR email='${email}'`, function (err, res) {
            if (err) reject(err);
            else resolve(res);
        })
    })
}

function findById(uid){
    return new Promise((resolve,reject)=>{
        con.query(`SELECT * from user WHERE id='${uid}'`,function(err,res){
            if(err) reject(err);
            else resolve(res);
        })
    })
}

/* 
    methods：添加用户
    addSqlParams -- 数组
*/
function addUser(addSqlParams) {
    console.log(addSqlParams);

    let addSql = 'INSERT INTO user(id,nickname,password,avatar,email,gender) VALUES(0,?,?,?,?,?)';
    return new Promise((resolve, reject) => {
        con.query(addSql, addSqlParams, function (err, res) {
            if (err) {
                //插入失败
                reject(err);
                return;
            }
            //插入成功
            resolve(res);
        })
    })
};


//更新用户
function updateUser(){

}



findByNameAndKey('xhw','123456').then(res=>{
    console.log(res);
}).catch(err=>{
    console.log(err);
})

module.exports = {
    findAll,
    addUser,
    findByNameAndKey,
    findByNameAndEmail,
    findById,
};