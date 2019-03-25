import axios from "axios";

$(document).ready(function() {
    axios.get(window.location.origin + '/order/app/ordermineapi').then(function(res) {
        if (res) {
            if (res.data.code === 1 && res.data.dishes && res.data.dishes.length) {
                const totalPrice = 0;
                for (const i = 0; i < res.data.dishes.length; i++) {
                    const item = res.data.dishes[i];
                    totalPrice += (item.price * item.count);
                    $('#summary').append(
                        "<div style='font-size: 14px; color: #c72323;margin-top: 5px;margin-bottom: 5px>"
                        + item.count + "个" + item.name + "</div>"
                    )
                    $('#title').html('总价：'+ totalPrice + '元');
                    $('#okBtn').html('取消该订单');
                    $('#okBtn').click(function() {
                        cancelOrder();
                    });
                    return;
                }
            }
            $('#title').html(res.data.message);
            if (res.data.code === 2) {
                $('#okBtn').html('去订餐');
                $('#okBtn').click(function () {
                    location.href = '/'
                })
            } else {
                $('#okBtn').html('重试');
                $('#okBtn').click(function() {
                    location.reload();
                })
            }
        }
    }).then(function() {
        $('#title').html('请求失败，请重试');
        $('#okBtn').click(function() {
            location.reload();
        })
    })
});


function cancelOrder() {
    axios.post(window.location.origin + '/order/app/ordercancl').then(function(res) {
        if (res.data.code === 0) {
            location.reload();
            return;
        }
        showAlert(res.data.message ? res.data.message : '取消失败')
    })
}