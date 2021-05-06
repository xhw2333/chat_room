/* 
    数据库工具类
*/

var mysql = require('mysql');

// 创建连接
var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'space'
})

con.connect();

/**
 * @description: 找出db数据库里的所有数据
 * @param {*} db
 * @return {*}
 */
function findAll(db) {
    return new Promise((resolve,reject)=>{
        con.query(`SELECT * FROM ${db}`, function(err,res){
            if(err) reject(err);
            else resolve(res);
        })
    })
}


function findByOr(db,params){
    
}


function findByAnd(){

}

function addData(){
    
}





module.exports = {
    findAll,
    findByOr,
    findByAnd,
}