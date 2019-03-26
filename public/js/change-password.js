import axios from "axios";

$(document).ready(function() {
    $('#okBtn').click(function () {
        const oldPassword = $('#oldPassword').val();
        const newPassword = $('#newPassword').val();
        const confirmPassword = $('#confirmPassword').val();

        if (oldPassword) {
            if (oldPassword.length < 6) {
                showAlert('请至少输入6位密码')
                return;
            }
        } else {
            showAlert('请输入旧密码，6-16字符')
            return;
        }

        if (newPassword) {
            if (newPassword.length < 6) {
                showAlert('请至少输入6位密码');
                return;
            } 
        } else {
            showAlert('请输入新密码，6-16个字符');
            return;
        }
        if (confirmPassword) {
            if (confirmPassword.length < 6) {
                showAlert('请至少输入6位密码');
                return;
            }
        } else {
            showAlert('重新输入一次新密码');
            return;
        }

        if (newPassword != confirmPassword) {
            showAlert('两次输入的密码不一样，请重新输入');
            return;
        }
        axios.post(window.location.origin + '/order/app/changepassword', {
            oldPassword: oldPassword,
            newPassword: newPassword
        }).then(function(res) {
            if (res.code === 4) {
                showAlert('Token已经过期，请重新登录', function() {
                    window.location.href = '/oder/app/login'
                })
            } else {
                showAlert(res.message);
            }
        })
    })
})