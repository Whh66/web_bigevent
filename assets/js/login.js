$(function() {
    $('#link_reg').on('click', function() {
        $('.login-box').hide().siblings('.reg-box').show();
    });
    $('#link_login').on('click', function() {
        $('.reg-box').hide().siblings('.login-box').show();
    })

    // 表单验证
    // 从layui中获取form对象
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        // 自定义一个叫pwd的校验规则
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 校验2次密码是否一致的规则
        repwd: function(value) {
            var pwd = $('.reg-box [name=password]').val();
            if (pwd !== value) {
                return '两次密码不一致！'
            }
        }
    })

    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
        e.preventDefault();
        var data = $(this).serialize();
        $.post('/api/reguser', data, function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            layer.msg('注册成功，请登录!');
            // 模拟人的点击行为（使其注册成功，自动切换到登录页面）
            $('#link_login').click();
        })
    })

    // 监听登录表单的提交事件
    $('#form_login').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/api/login',
            // 快速获取表单数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('登录成功!');
                // 将登录成功得到的token字符串，保存到 localStorage 中
                localStorage.setItem('token', res.token);
                // 跳转到后台主页
                location.href = '/index.html'
            }
        })
    })
})