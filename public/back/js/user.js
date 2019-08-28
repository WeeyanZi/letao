$(function () {
    var currentPage = 1;
    var pageSize = 5;
    var currentId;
    var isDelete;

    render();
    function render() {
        $.ajax({
            url: '/user/queryUser',
            type: 'get',
            data: { page: currentPage, pageSize: pageSize },
            dataType: 'json',
            success: function (info) {
                var htmlStr = template('tpl', info);
                $('tbody').html(htmlStr);

                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    currentPage: info.page,
                    totalPages: Math.ceil(info.total / info.size),//总页数
                    size: "small",//设置控件的大小，mini, small, normal,large
                    onPageClicked: function (event, originalEvent, type, page) {
                        //为按钮绑定点击事件 page:当前点击的按钮值
                        currentPage = page;
                        render();
                    }
                })
            }
        })
    }

    $('tbody').on('click', '.btn', function () {
        $('#userModal').modal('show');
        currentId = $(this).parent().data('id');
        isDelete = $(this).hasClass('btn-danger') ? 0 : 1;
    })

    $('#submitBtn').click(function () {
        $.ajax({
            url: '/user/updateUser',
            type: 'post',
            data: { id: currentId, isDelete: isDelete },
            dataType: 'json',
            success: function (info) {
                if(info.success){
                    $('#userModal').modal('hide');
                    render();
                }
            }
        })
    });
})