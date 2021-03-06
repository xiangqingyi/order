
$(document).ready(function() {
    axios.get(window.location.origin + '/order/app/ordermineapi').then(function(res) {
        console.log(res);
        if (res.data.code === 0 && res.data.dishes && res.data.dishes.length > 0) {
            var totalPrice = 0;
            for (let i = 0; i < res.data.dishes.length; i++) {
                const item = res.data.dishes[i];
                totalPrice += (item.price * item.count);

                $('#dishes').append("<div style='font-size: 14px; color: #c72323; margin-top: 5px; margin-bottom: 5px'>" + item.count + "个" + item.name + "</div>");
            }
            $('#totalPrice').html(totalPrice);
            return;
        }

        showAlert(res.data.message);
    });

    $('.btn').click(function() {
        window.location.href = '/order/app/restaurants';
    })
})