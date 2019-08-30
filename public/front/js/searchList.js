$(function () {
    var key = getSearch('key');
    $('.search_input').val(key);

    render();

    function render() {
        // <div class="loading"></div>
        $('.lt_product').html('<div class="loading"></div>');

        var params = {};
        params.proName = $('.search_input').val();
        params.page = 1;
        params.size = 100;

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
                    var htmlStr = template('productTpl', info);
                    $('.lt_product').html(htmlStr)
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
        render();

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

    $('.lt_sort a[data-type]').click(function () {
        if ($(this).hasClass('current')) {
            $(this).find('i').toggleClass("fa-angle-up").toggleClass("fa-angle-down");
        } else {
            $(this).addClass('current').siblings().removeClass('current');
        }
        render();
    })

})