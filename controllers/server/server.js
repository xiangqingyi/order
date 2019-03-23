const mysql = require('mysql');
const crypto = require('crypto');
const MySQLClient = require('../../libs/MySQLClient');
const mysqlClientInstance = new MySQLClient();
const _ = require('lodash');

exports.login = async (req, res) => {
    if (req.method === 'GET') {
        return res.render('login' )
    } else if (req.method === 'POST') {
        const obj = _.pick(req.body, 'userName', 'passwrod');
        const sha = crypto.createHash('md5');
        sha.update(obj.passwrod);
        const passwrod_md5 = sha.digest('hex');
        mysqlClientInstance.exec('SELECT id, name, password FROM t_user WHERE name=? AND password=?',[obj.userName, passwrod_md5], function(err, rows) {
            if (err) {
                return res.send({
                    status: false,
                    message: '查询数据失败'
                })
            } else {
                if (rows.length === 0) {
                    return res.send({
                        status: false,
                        message: '用户名或者密码错误'
                    })
                } else {
                    req.session.user = {};
                    req.session.user.id = rows[0].id;
                    return res.send({
                        status: true,
                        message: '登录成功',
                        userId: rows[0].id
                    })
                }
            }
        })
    }
}

exports.loginout = async (req, res) => {
    if (req.method === 'GET') {

    } else if (req.method === 'POST') {
        req.session.user = {};
        return res.send({
            status: true,
            message: '登出成功',
            data: null
        })
    }
}


exports.indexHandler = async (req, res) => {
    const userid = req.session.user.id;
    if (userid) {
        mysqlClientInstance.exec('SELECT * FROM t_restaurant limit 0,10',null,function(err, rows) {
            if (err) {
                console.log(err);
                throw err;
            } else {
                return res.render('restaurant/list',{
                    rows: rows
                })
            }
        })
    } else{
        return res.redirect('/login')
    }
}