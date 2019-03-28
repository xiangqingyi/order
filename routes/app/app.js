const express = require('express');
const router = express.Router();
const app = require('../../controllers/app/app');

router.get('/restaurants', app.index); // /order/app

router.get('/list/:restaurantId', app.restaurantlist);
// 订单模块
router.post('/addorder', app.addOrder); // 提交订单 /order/app/addorder
router.get('/ordermine', app.mineOrder) // 获取我的订单页面  /order/app/ordermine
router.get('/orderall', app.getAllOrders); // 获取所有的order页面  /order/app/orderall
router.get('/ordersuccess', app.addOrderSuccess); // 添加订单成功页面 /order/app/ordersuccess
router.post('/ordercancal',app.cancalOrder)   // 取消订单 /order/app/ordercancal
router.get('/ordermineapi', app.getMineOrder)  // /order/app/ordermineapi

module.exports = router;