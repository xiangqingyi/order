import axios from "axios";

$(document).ready(function () {
    $('#loginBtn').click(function () {
        const userName = $('#username').val();
        const password = $('#password').val();
        if (!userName || !password) {
            showAlert('用户名或密码不能为空.请重新输入');
            return;
        }
        axios.post(window.location.origin +'/login',{
            userName: userName,
            password: password
        }).then(function(res) {
            if (res.data.status) {
                location.href = '/';
                return;
            } else {
                showAlert(message);
            }
        })
    })
})