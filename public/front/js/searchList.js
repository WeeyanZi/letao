$(function () {
    var key = getSearch('key');
    $('.search_input').val(key);

    var currentPage = 1;
    var pageSize = 2;

    // render();

    function render(callback) {
        // <div class="loading"></div>
        // $('.lt_product').html('<div class="loading"></div>');

        var params = {};
        params.proName = $('.search_input').val();
        params.page = currentPage;
        params.pageSize = pageSize;

        var $current = $('.lt_sort a.current');
        if ($current.length > 0) {
            var sortName = $current.data('type');
            //fa-angle-down
            var sortValue = $current.find('i').hasClass('fa-angle-down') ? 2 : 1;
            params[sortName] = sortValue;
        }

        setTimeout(function () {
            $.ajax({
                type: 'get',
                url: '/product/queryProduct',
                data: params,
                dataType: 'json',
                success: function (info) {
                    callback && callback(info);
                }
            })
        }, 500);
    }

    $('.search_btn').click(function () {

        var val = $('.search_input').val().trim();
        if (val === '') {
            mui.toast('请输入搜索关键字', { duration: 2000 });
            return;
        }

        mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();

        var history = localStorage.getItem('search_list') || '[]';
        var arr = JSON.parse(history);

        var index = arr.indexOf(val);
        if (index != -1) {
            arr.splice(index, 1);
        }
        if (arr.length >= 10) {
            arr.pop();
        }

        arr.unshift(val);
        localStorage.setItem('search_list', JSON.stringify(arr));

    })

    $('.lt_sort a[data-type]').on('tap', (function () {
        console.log(123456);
        if ($(this).hasClass('current')) {
            $(this).find('i').toggleClass("fa-angle-up").toggleClass("fa-angle-down");
        } else {
            $(this).addClass('current').siblings().removeClass('current');
        }
        mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
    }))


    // 下拉刷新  上拉记载
    mui.init({
        pullRefresh: {
            container: ".mui-scroll-wrapper",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            down: {
                auto: true,
                callback: function () {    //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                    currentPage = 1;
                    render(function (info) {
                        var htmlStr = template('productTpl', info);
                        $('.lt_product').html(htmlStr);

                        mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
                        mui('.mui-scroll-wrapper').pullRefresh().refresh(true);
                    });
                }
            },
            up: {
                callback: function () {   //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                    currentPage++;
                    render(function (info) {
                        var htmlStr = template('productTpl', info);
                        $('.lt_product').append(htmlStr);
                        if (info.data.length === 0) {
                            mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh(true);
                        } else {
                            mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh(false);
                        }

                    });
                }
            }
        }
    });

    $('.lt_product').on('tap', 'a', function () {
        location.href = $(this).attr('href');
    })

})