const mysql = require('mysql');
const crypto = require('crypto');
const MySQLClient = require('../../libs/MySQLClient');
const mysqlClientInstance = new MySQLClient();
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