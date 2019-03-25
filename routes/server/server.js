const express = require('express');
const router = express.Router();
const server = require('../../controllers/server/server');

router.all('/login', server.login);  // order/server.lofin
router.all('/loginout', server.loginout);
router.get('/dishes', server.dishesIndex) // order/server/dishes  菜单管理
router.all('/adddish', server.addDish) // order/server/adddish 增加菜品
router.post('/delete/alldishes/:restaurantId', server.deleteAllRestaurants) // order/server/delete/alldishes/:restaurantId
router.post('/delete/dish/:id', server.deleteDish) // 删除指定菜品 order/server/delete/dish/:id
router.get('/showdish/:id', server.showDish) // 显示某个dish order/server/showdish/:id
router.all('/editdish/:id', server.editDish) // 修改dish的信息 order/server/editdish/:id
router.get('/restaurants', server.restaurantIndex); // 餐馆管理 order/server/restaurants
router.all('/addrestaurant', server.addRestaurant); // 增加餐馆 order/server/addrestaurant
router.post('/delete/allrestaurants', server.deleteAllRestaurants); //删除所有的餐馆 order/server/delete/allrestaurants
router.post('/delete/restaurant/:restaurantId', server.deleteRestaurant) //删除指定的餐馆 order/server/delete/restaurant/:restaurantId
router.all('/editrestaurant/:restaurantId', server.editRestaurant) //修改指定的餐馆 order/server/editrestaurant/:restaurantId


module.exports = router;