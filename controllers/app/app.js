const mysql = require('mysql');
const crypto = require('crypto');
const MySQLClient = require('../../libs/MySQLClient');
const mysqlClientInstance = new MySQLClient();
const dtime = require('time-formater');
const _ = require('lodash');

exports.restaurantlist = async (req, res) => {
    const restaurantId = req.params.restaurantId;
    mysqlClientInstance.exec('SELECT * FROM t_restaurant WHERE id=?',[restaurantId],function(err, restaurants) {
        if (err) {
            console.log('获取餐厅失败')
        } else {
            if (!restaurants || restaurants.length === 0) {
                console.log('没有这个餐厅');
            } else {
                console.log('有这个餐厅');
                mysqlClientInstance.exec('SELECT * FROM t_dishes WHERE restaurant_id=?',[restaurantId],function(err, dishes) {
                    if(err) {
                        console.log('获取dishes失败')
                    } else {
                        if(!dishes) {
                            console.log('获取食物失败')
                        } else {
                            const classfyArr = [];
                            const classfies = restaurants[0].classifies.split('|');

                            classfies.forEach(function(classfy) {
                                classfyArr.push(classfy);
                            })
                            const resultArr = new Array();
                            classfyArr.forEach(function(classfy,index) {
                                const resArr = new Array();
                                dishes.forEach(function(dish) {
                                    if (dish.classify === classfy) {
                                        resArr.push(dish);
                                    }
                                })
                                resultArr[index] = resArr;
                            })
                            const body = {
                                restaurant: restaurants[0],
                                dishes: resultArr
                            }
                            console.log(body);
                            return res.render('dishes/list',body);
                            // return res.send(body);
                        }
                    }
                })
            }
        }
    })
}

exports.addOrder = async (req,res) => {
    if (req.method === 'POST') {
        const userid = req.session.user.id;
        if (!userid) {
            return res.send({
                status: false,
                message: '请重新登录',
                code: 1
            })
        } else {
            const today = dtime(new Date()).format('YYYY-MM-DD');
            mysqlClientInstance.exec('SELECT * FROM t_order WHERE user_id=? AND selected_date=?',[userid, today], function(err,rows) {
                if (rows && rows.length > 0) {
                    return res.send({
                        status: false,
                        message: '一天只能下一次订单',
                        code: 5
                    }) 
                } else {
                    const orders = eval(req.body.orders);
                    if (orders && orders.length > 0) {
                        for (var i in orders) {
                            const order = orders[i];
                            const dishes_id = order.dishes_id;
                            const dishes_count = order.dishes_count;
                            mysqlClientInstance.exec('INSERT INTO t_order (selected_date,user_id,dishes_id,dishes_count) VALUES (?, ?, ?, ?)',[today, userid, dishes_id, dishes_count],function(err,rows) {
                                if (err) {
                                    console.log(err.stack);
                                    return res.send({
                                        status: false,
                                        message: '服务器端错误',
                                        code: 1
                                    })
                                } else {
                                    if (Number(i) === orders.length - 1){
                                        return res.send({
                                            status: true,
                                            message: '提交订单成功',
                                            code: 0,
                                        })
                                    }
                                }
                            })
                        }
                    }
                }
            })
        }
    }
}

exports.mineOrder = async (req, res) => {
    return res.render('order/mine')
}

exports.getAllOrders = async (req, res) => {
    // 都是获取当天的订单
    const today = dtime(new Date()).format('YYYY-MM-DD');
    const sql = "SELECT t_user.realName, t_dishes.name, t_dishes.price, t_order.dishes_count FROM t_user, t_order, t_dishes ";
    sql += "WHERE t_order.selected_date = ? AND t_order.user_id = t_user.id AND t_order.dishes_id = t_dishes.id";

    // 查询菜单表
    mysqlClientInstance.exec(sql,[today], function(err, rows) {
        if (err) {
            console.log(err.stack);
        } else {
            if (!rows) {
                rows = [];
            }
            return res.render('order/all',{
                orders: rows
            })
        }
    })
}

// 提交订单成功返回页面
exports.addOrderSuccess = async (req, res) => {
    if (req.method === 'GET') {
        return res.render('order/success', {
            totalPrice: 28
        })
    }
}

// 取消订单 (只取消当天的订单  所有的操作的都是基于当天的时间)
exports.cancelOrder = async (req, res) => {
    if (req.method === 'POST') {
        const userid = req.session.user.id;
        if (userid) {
            const today = dtime(new Date()).format('YYYY-MM-DD');
            mysqlClientInstance.exec('DELETE FROM t_order WHERE user_id=? AND selected_date=?',[userid, today],function(err, rows) {
                if (err) {
                    return res.send({
                        code: 1,
                        status: false,
                        message: '服务端异常'
                    })
                } else {
                    return res.send({
                        code: 0,
                        message: '订单取消删除成功',
                        status: true
                    })
                }
            })
        } else {
            return res.send({
                code: 4,
                message: '请重新登录',
                status: false
            })
        }
    }
}

exports.getMineOrder = async (req,res) => {
    console.log(req.session.user);
    const userid = req.session.user.id;
    if (!userid) {
        return res.send({
            status: false,
            code: 1,
            message: '请重新登录'
        })
    } else {
        const today = dtime(new Date()).format('YYYY-MM-DD');
        mysqlClientInstance.exec('SELECT id, dishes_id, dishes_count FROM t_order WHERE user_id = ? AND selected_date = ?', [userid, today],function(err, orders) {
            if (err) {
                return res.send({
                    code: 1,
                    status: false,
                    message: '服务端异常'
                })
            } else {
                const arr = [];
                if (orders.length === 0) {
                    return res.send({
                        code: 2,
                        message: '没有订单',
                        status: true
                    })
                } else {
                    for (const i = 0; i < orders.length; i++) {
                        mysqlClientInstance.exec('SELECT name,price FROM t_dishes WHERE id=?',[orders[i].dishes_id], function(err, dishes) {
                            if (err) {
                                return res.send({
                                    code: 1,
                                    status: false,
                                    message: '服务端出错'
                                }) 
                            } else {
                                dishes[0].count = orders[i].dishes_count;
                                arr[i] = dishes[0];
                                if (i == orders.length - 1) {
                                    return res.send({
                                        code: 0,
                                        status: true,
                                        message: '获取订单信息成功',
                                        dishes: arr
                                    })
                                }
                            }
                        })
                    }
                }
            }
        })
    }
}

exports.index = async (req, res) => {
    const user = req.session.user;
    if (user){
        mysqlClientInstance.exec('SELECT * FROM t_restaurant', null, function(err, rows) {
            if (err) {
                return res.send({
                    code: 1,
                    message: '查找餐厅失败',
                    status: false
                })
            } else {
                return res.render('restaurant/list', {
                    rows: rows
                })
            }
        })
    } else {
        return res.redirect('/order/server/login');
    }
}