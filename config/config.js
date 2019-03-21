'use strict';

const config = {
    db: {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'password',
        database: 'order_db'
    },
    title: '订餐厅',
    session: {
        secret: 'ordersecret'
    },
    homepage: '/order',
    api: 'order/api',
    admin: 'order/admin',

};

module.exports = config;