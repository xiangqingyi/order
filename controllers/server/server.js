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

// 后台首页
exports.adminIndex = async (req, res) => {
    const restaurantId = req.params.restaurantId;
    const sql = "SELECT * FROM t_dishes WHERE restaurant_id=?";
    //查询菜单表
    mysqlClientInstance.exec(sql, [restaurantId], function(err, rows) {
        if (err) {
            console.log(err);
        } else {
            if (!rows) {
                rows = [];
            }
            return res.render('admin/dishes/index', {
                restaurantId: restaurantId
            })
        }
    })
}


// 后天加菜品
exports.addDish = async (req, res) => {
    if (req.method === 'GET') {
        return res.render('admin/dishes/add', {
            restaurantId: req.params.restaurantId
        })
    } else if (req.method === 'POST') {
        const dishes = req.body;

        if (dishes) {
            const sql = "INSERT INTO t_dishes (icon, name, price, level, levelName, classify, restaurant_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
            const icon = dishes.icon;
            const name = dishes.name;
            const price = dishes.price;
            const level = 0;
            const levelName = "超级好吃";
            const classify = dishes.classify;
            const restaurant_id = req.params.restaurantId;
            mysqlClientInstance.exec(sql, [icon, name, price, level, levelName, classify, restaurant_id], function(err, rows) {
                if (err) {
                    return res.send({
                        code: 1,
                        message: '失败',
                        status: false
                    })
                } else {
                    return res.send({
                        code: 0,
                        message: '操作成功',
                        status: true
                    })
                }
            })
        } else {
            return res.send({
                code: 1,
                message: '失败',
                status: false
            })
        }
    }
}

// 删除某个餐馆所有的菜
exports.deleteAll = async (req, res) => {
    const restaurantId = req.params.restaurantId;
    const sql = "DELETE FROM t_dishes WHERE restauran_id=?";
    mysqlClientInstance.exec(sql, [restaurantId],function(err, rows) {
        if (err) {
            console.log(err);
            return res.send({
                code: 1,
                message: '删除失败'
            })
        } else {
            return res.send({
                code: 0,
                message: '删除成功'
            })
        }
    })
}

// 删除某个餐馆指定的某个菜
exports.deleteDish = async (req, res) => {
    const sql = "DELETE FROM t_dishes WHERE id=?";
    const id = req.params.id;
    mysqlClientInstance.exec(sql, [id], function(err, rows) {
        if (err) {
            return res.send({
                code: 1,
                status: false,
                message: '删除失败'
            })
        } else {
            return res.send({
                code: 0,
                message: '删除成功',
                status: true
            })
        }
    })
}

// 显示指定id的菜品
exports.showDish = async (req, res) => {
    const sql = "SELECT * FROM t_dishes WHERE id = ?";
    const id = req.params.id;
    mysqlClientInstance.exec(sql, [id], function(err, rows) {
        if (err) {
            console.log(err);
        } else {
            if (!rows || rows.length === 0) {
                return res.send({
                    code: 1,
                    message: '没有找到指定id的餐厅'
                })
            } else {
                return res.render('admin/dishes/detail', {
                    dishes: rows[0]
                })
            }
        }
    })
}

// 修改餐厅的信息
exports.editRestaurant = async (req, res) => {
    if (req.method === 'GET') {
        const sql = "SELECT * FROM t_dishes WHERE id=?";
        const id = req.params.id;
        mysqlClientInstance.exec(sql, [id], function(err, rows) {
            if (err) {
                console.log(err);
                return res.send({
                    code: 1,
                    message: '获取餐厅信息失败'
                })
            } else {
                return res.render('admin/dishes/edit',{
                    restaurantId: id
                })
            }
        })
    } else if (req.method === 'POST') {
        const id = req.params.id;
        const dishes = req.body;
        if (id && dishes) {
            const sql = "UPDATE t_dishes SET icon=?, name=?,level=?,levelName=?, classify=? WHERE id="+id;
            const icon = dishes.icon;
            const name = dishes.name;
            const price = dishes.price;
            const level = 0;
            const levelName = "超级好吃";
            const classify = dishes.classify;
            mysqlClientInstance.exec(sql, [icon, name, price, level, levelName, classify], function (err, result) {
                if (err) {
                    return res.send({
                        code: 1,
                        message: "更新餐厅信息失败"
                    })
                } else {
                    return res.send({
                        code: 0,
                        message: "更新餐厅信息失败"
                    })
                }
            })
        }
    }
}