$(function () {
    $.ajax({
        url: '/user/queryUser',
        type: 'get',
        data: { page: 1, pageSize: 5 },
        dataType: 'json',
        success: function (info) {
            console.log(info);
            var htmlStr = template('tpl', info);
            $('tbody').html(htmlStr);
        }
    })
})