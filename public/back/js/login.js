$(function () {

    // 使用bootstrapValidator插件进行表单验证
    $('#form').bootstrapValidator({
        // 配置校验图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',    //检验成功
            invalid: 'glyphicon glyphicon-remove',  //检验失败
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            username: {
                validators: {
                    notEmpty: {
                        message: "用户名不能为空"
                    },
                    stringLength: {
                        min: 2,
                        max: 6,
                        message: "用户名长度必须是2-6位"
                    },
                    callback: {
                        message: "用户名不存在"
                    }
                }
            },
            password: {
                validators: {
                    notEmpty: {
                        message: "密码不能为空"
                    },
                    stringLength: {
                        min: 6,
                        max: 12,
                        message: "密码长度必须是6-12位"
                    },
                    callback: {
                        message: "密码错误"
                    }
                }
            }
        }
    });

    $("#form").on('success.form.bv', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/employee/employeeLogin',
            data: $('#form').serialize(),
            dataType: 'json',
            success: function (data) {
                if (data.success) {
                    location.href = 'index.html'
                }
                if (data.error === 1000) {
                    $('#form').data('bootstrapValidator').updateStatus("username", "INVALID", "callback");
                }
                if (data.error === 1001) {
                    $('#form').data('bootstrapValidator').updateStatus("password", "INVALID", "callback");
                }
            }
        });
    });

    $('[type="reset"]').click(function () {
        $('#form').data('bootstrapValidator').resetForm();
    })



})