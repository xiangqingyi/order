const express = require('express');
const router = express.Router();
const server = require('../../controllers/server/server');

router.get('/', server.serverIndex); // order/server

router.all('/login', server.login);  // order/server.lofin
router.all('/loginout', server.loginout);

router.get('/dishes', server.dishesIndex) // order/server/dishes  菜单管理
router.all('/adddish/:restaurantId', server.addDish) // order/server/adddish 增加菜品
router.post('/delete/alldishes/:restaurantId', server.deleteAllDishes) // order/server/delete/alldishes/:restaurantId
router.post('/delete/dish/:id', server.deleteDish) // 删除指定菜品 order/server/delete/dish/:id
router.get('/showdish/:id', server.showDish) // 显示某个dish order/server/showdish/:id
router.all('/editdish/:id', server.editDish) // 修改dish的信息 order/server/editdish/:id

router.get('/restaurants', server.restaurantIndex); // 餐馆管理 order/server/restaurants
router.all('/addrestaurant', server.addRestaurant); // 增加餐馆 order/server/addrestaurant
router.post('/delete/allrestaurants', server.deleteAllRestaurants); //删除所有的餐馆 order/server/delete/allrestaurants
router.post('/delete/restaurant/:restaurantId', server.deleteRestaurant) //删除指定的餐馆 order/server/delete/restaurant/:restaurantId
router.get('/showrestaurant/:restaurantId', server.showRestaurant)
router.all('/editrestaurant/:restaurantId', server.editRestaurant) //修改指定的餐馆 order/server/editrestaurant/:restaurantId
router.get('/showrestaurant/dishes/:restaurantId', server.showRestaurantDishes)

router.get('/users', server.userIndex);
router.all('/adduser', server.addUser);
router.post('/delete/alluser', server.deleteAllUsers);
router.post('/delete/user/:userId', server.deleteUser);
router.get('/showuser/:userId', server.showUser);
router.all('/edituser/:userId', server.editUser);

router.get('/orders', server.ordersIndex); // /order/server/orders
module.exports = router;