
$(document).ready(function () {
    $('#loginBtn').click(function () {
        const userName = $('#username').val();
        const password = $('#password').val();
        console.log(userName, password);
        if (!userName || !password) {
            showAlert('用户名或密码不能为空.请重新输入');
            return;
        }
        axios.post(window.location.origin +'/order/server/login',{
            userName: userName,
            password: password
        }).then(function(res) {
            if (res.data.status) {
                location.href = '/order/app/ordermine';
                return;
            } else {
                showAlert(message);
            }
        })
    })
})