$(function () {
    var productId = getSearch('productId');

    $.ajax({
        type: 'get',
        url: '/product/queryProductDetail',
        data: { id: productId },
        dataType: 'json',
        success: function (info) {
            var htmlStr = template('productTpl', info);
            $('.lt_main .mui-scroll').html(htmlStr);

            var gallery = mui('.mui-slider');
            gallery.slider({
                interval: 2000//自动轮播周期，若为0则不自动播放，默认为0；
            });

            mui('.mui-numbox').numbox();
        }
    })
})