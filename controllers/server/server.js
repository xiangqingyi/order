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

// 菜单管理
exports.dishesIndex = async (req, res) => {
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
exports.deleteAllDishes = async (req, res) => {
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

// 修改菜品的信息
exports.editDish = async (req, res) => {
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


// 后台餐馆管理 获取餐馆管理的页面
exports.restaurantIndex = async (req, res) => {
    const sql = "SELECT id, name, phoneNumber FROM t_restaurant";
    mysqlClientInstance.exec(sql, null, function(err,restaurants) {
        if (err) {
            console.log(err);
        } else {
            if (!restaurants) {
                restaurants = [];
            }
            return res.render('admin/restaurant/index', {
                restaurants: restaurants
            })
        }
    })
}

// 后台增加餐馆
exports.addRestaurant = async (req, res) => {
    if (req.method === 'GET') {
        return res.render('admin/restaurant/add');
    } else if (req.method === 'POST') {
        const restaurant = req.body;
        if (restaurant) {
            const sql = "INSERT INTO t_restaurant (icon, name, phoneNumber, email, city, address, level, levelName, classifies) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            const icon = restaurant.icon;
            const name = restaurant.name;
            const phoneNumber = restaurant.phoneNumber;
            const email = restaurant.email;
            const city = restaurant.city;
            const address = restaurant.address;
            const level = restaurant.level;
            const levelName = "三星级";
            const classifies = restaurants.classifies;
            mysqlClientInstance.exec(sql, [icon, name, phoneNumber, email, city, address, level, levelName, classifies], function (err, result, fields) {
                if (err) {
                    return res.send({
                        code: 1,
                        message: '新增餐厅失败'
                    })
                } else {
                    return res.send({
                        code: 0,
                        message: '新增餐厅成功'
                    })
                }
            })
        } else {
            return res.send({
                code: 1,
                message: '获取前端传来的数据失败'
            })
        }
    }
}

// 删除所有的餐馆
exports.deleteAllRestaurants = async (req, res) => {
    const sql = "DELETE FROM t_restaurant";
    mysqlClientInstance.exec(sql, null, function(err, rows) {
        if (err) {
            return res.send({
                code: 1,
                message: '删除餐馆失败'
            })
        } else {
            return res.send({
                code: 0,
                message: '删除成功'
            })
        }
    })
}

// 删除指定ID的餐馆
exports.deleteRestaurant = async (req, res) => {
    const sql = "DELETE FROM t_restaurant WHERE id = ?";
    const restaurantId = req.params.restaurantId;
    mysqlClientInstance.exec(sql, [restaurantId], function(err, rows) {
        if (err) {
            return res.send({
                code: 1,
                message: '删除餐馆失败'
            })
        } else {
            return res.send({
                code: 0,
                message: '删除餐馆成功'
            })
        }
    })
}

// 根据id显示餐馆详情
exports.showRestaurant = async (req, res) => {
    const sql = "SELECT * FROM t_restaurant WHERE id=?";
    const id = req.params.restaurantId;
    mysqlClientInstance.exec(sql, [id], function(err, rows) {
        if (err || !rows)  {
            return res.send({
                code: 1,
                message: '获取餐馆详情失败'
            })
        } else {
            if (rows && rows.length === 1) {
                return res.render('admin/restaurant/detail', {
                    restaurant: rows[0]
                })
            }
        }
    })
}

// 根据id修改餐馆的信息
exports.editRestaurant = async (req, res) => {
    if (req.method === 'POST') {
        const restaurantId = req.params.restaurantId;
        const restaurant = req.body;
        if (restaurantId && restaurant) {
            const sql = "UPDATE t_restaurant SET icon=?, name=?, phoneNumber=?, email=?, city=?, address=?, level=?, levelName=?, classifies=? WHERE id=" + restaurantId;
            const icon = restaurant.icon;
            const name = restaurant.name;
            const phoneNumber = restaurant.phoneNumber;
            const email = restaurant.email;
            const city = restaurant.city;
            const address = restaurant.address;
            const level = restaurant.level;
            const levelName = '三星级';
            const classifies = restaurant.classifies;
    
            mysqlClientInstance.exec(sql, [icon, name, phoneNumber,email, city, address, level, levelName, classifies], function(err, rows) {
                if (err) {
                    return res.send({
                        code: 1,
                        message: '失败'
                    })
                } else {
                    return res.send({
                        code: 0,
                        message: '成功'
                    })
                }
            })
        }
    } else if (req.method === 'GET') {
        const sql = "SELECT * FROM t_restaurant WHERE id = ?";
        mysqlClientInstance.exec(sql, [req.params.restaurantId], function(err, rows) {
            if (err || !rows || rows.length === 0) {
                return res.send({
                    code: 1,
                    message: '获取餐馆信息失败'
                })
            } else if (rows && rows.length === 1) {
                return res.render('admin/restaurant/edit', {
                    restaurant: rows[0]
                })
            }
        })
    }

}

// 用户管理 user
exports.userIndex = async (req, res) => {
    const sql = "SELECT id, name, realName, phoneNumber FROM t_user";
    mysqlClientInstance.exec(sql, null, function(err, users) {
        if(err) {
            return res.send({
                code: 1,
                message: '获取用户失败'
            })
        } else {
            if (!users) {
                users = [];
            }
            return res.send('admin/user/index', {
                users: users
            })
        }
    })
}

// 添加用户
exports.addUser = async (req, res) => {
    const user = req.body;

    if (user) {
        const sql = "INSERT INTO t_user (icon, name, realName, birthday, phoneNumber, email, country, city, level, levelName) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const icon = user.icon;
        const name = user.name;
        const realName = user.realName;
        const birthday = user.birthday;
        const phoneNumber = user.phoneNumber;
        const email = user.email;
        const country = user.country;
        const city = user.city;
        const level = user.level;
        const levelName = '武汉热干面';
        mysqlClientInstance.exec(sql, [icon, name, realName, birthday, phoneNumber, email, country, city, level, levelName], function(err, rows) {
            if (err) {
                return res.send({
                    code: 1,
                    message: '新增用户失败'
                })
            } else {
                return res.send({
                    code: 0,
                    message: '新增用户成功'
                })
            }
        })
    } else {
        return res.send({
            code: 1,
            message: '获取前端传来的数据失败'
        })
    }
}

exports.deleteAllUsers = async (req, res) => {
    const sql = "DELETE FROM t_user WHERE id = ?";
    mysqlClientInstance.exec(sql, [req.params.userId], function (err, rows) {
        if (err) {
            return res.send({
                code: 1,
                message: '删除全部的用户失败'
            }) 
        } else {
            return res.send({
                code: 0,
                message: '删除全部用户成功'
            })
        }
    })
}

exports.deleteUser = async (req, res) => {
    const sql = "DELETE FROM t_user WHERE id=?";
    mysqlClientInstance.exec(sql, [req.params.userId], function(err, rows) {
        if (err) {
            return res.send({
                code: 1,
                message: '删除用户失败'
            })
        } else {
            return res.send({
                code: 0,
                message: '删除该用户成功'
            })
        }
    })
}

exports.showUser = async (req,res) => {
    const sql = "SELECT * FROM t_user WHERE id = ?";
    mysqlClientInstance.exec(sql, [req.params.userId], function (err, rows) {
        if (err || !rows || rows.length === 0) {
            return res.send({
                code: 1,
                message: '获取指定用户失败'
            })
        } else {
            return res.render('admin/user/detail', {
                user: rows[0]
            })
        }
    })
}

// 编辑指定用户
exports.editUser = async (req, res) => {
    if (req.method === 'GET') {
        const sql = "SELECT * FROM t_user WHERE id = ?";
        mysqlClientInstance.exec(sql, [req.params.userId],function(err, rows) {
            if (err || !rows || rows.length === 0) {
                return res.render({
                    code: 1,
                    message: '获取用户失败'
                })
            } else {
                return res.render('admin/user/edit', {
                    user: rows[0]
                })
            }
        })
    } else if (req.method === 'POST') {
        const userId = req.params.userId;
        const user = req.body;
        if (userId && user) {
            const sql = "UPDATE t_user SET icon=?, name=?, realName=?, birthday=?, phoneNumber=?, email=?, country=?, city=?, level=?, levelName=? WHERE id=" + userId;
            const icon = user.icon;
            const name = user.name;
            const realName = user.realName;
            const birthday = user.birthday;
            const phoneNumber = user.phoneNumber;
            const email = user.email;
            const country = user.country;
            const city = user.city;
            const level = user.level;
            const levelName = "武汉热干面"

            mysqlClientInstance.exec(sql, [icon, name,realName, birthday, phoneNumber, email, country, city, level, levelName], function(err, rows) {
                if (err) {
                    return res.send({
                        code: 1,
                        message: '更新用户失败'
                    })
                } else {
                    return res.send({
                        code: 0,
                        message: '更新用户成功'
                    })
                }
            })
        } else {
            return res.send({
                code: 1,
                message: '获取前端传来的数据失败'
            })
        }
    }
}