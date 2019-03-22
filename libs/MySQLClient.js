const config = require('../config/config');
const mysql = require('mysql');

function MySQLClient() {
    const connection;
    function connection(callback) {
        connection = mysql.createConnection(config.db);
        connection.on('error',function (err) {
            if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                connect(callback);
            } else {
                throw err
            }
        });
        connection.connect(callback);
    }

    MySQLClient.prototype.exec = function(sql, values, callback) {
        if (connection) {
            connection.query(sql, values, callback);
        } else {
            console.log('mysql没有连接上');
            connect(function (err) {
                if (err) {
                    console.log(err.stack);
                } else {
                    console.log('mysql 连接成功');
                    connection.query(sql, values, callback);
                }
            })
        }
    };
    MySQLClient.prototype.end = function(callback) {
        if (connection) {
            connection.end(callback);
        } else {
            console.log('mysql没有连接上');
        }
    }
}
module.exports = MySQLClient;