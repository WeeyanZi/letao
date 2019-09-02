$(function () {

    // render();

    function render() {
        $.ajax({
            type: 'get',
            url: '/cart/queryCart',
            dataType: 'json',
            success: function (info) {
                if (info.error === 400) {
                    location.href = 'login.html?retUrl=' + location.href;
                    return;
                }

                var htmlStr = template('cartTpl', { arr: info });
                $('.lt_main .mui-table-view').html(htmlStr);
                mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
            }
        })
    }


    mui.init({
        pullRefresh: {
            container: ".mui-scroll-wrapper",
            down: {
                auto: true,
                callback: function () {
                    render();
                }
            }
        }
    });

    $('.lt_main').on('tap', '.btn_del', function () {
        var id = $(this).data('id');
        $.ajax({
            type: 'get',
            url: '/cart/deleteCart',
            data: {
                id: [id]
            },
            dataType: 'json',
            success: function (info) {
                if (info.success) {
                    mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
                }
            }
        })
    })


    $('.lt_main').on('tap', '.btn_edit', function () {
        var obj = this.dataset;
        var id = obj.id;

        var htmlStr = template('editTpl', obj);
        htmlStr = htmlStr.replace(/\n/g, '');
        mui.confirm(htmlStr, '编辑商品', ['确认', '取消'], function (e) {
            if (e.index === 0) {
                var size = $('.lt_size span.current').text();
                var num = $('.mui-numbox-input').val();
                $.ajax({
                    type: 'post',
                    url: '/cart/updateCart',
                    data: { id: id, size: size, num: num },
                    dataType: 'json',
                    success: function (info) {
                        if (info.success) {
                            render();
                        }
                    }
                });
            }
        });
        mui('.mui-numbox').numbox();
    })


    $('body').on('click', '.lt_size span', function () {
        $(this).addClass('current').siblings().removeClass('current');
    })

})