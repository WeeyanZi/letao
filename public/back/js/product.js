$(function () {

    var currentPage = 1;
    var pageSize = 5;
    var picArr = [];

    render();

    function render() {
        $.ajax({
            type: 'get',
            url: '/product/queryProductDetailList',
            data: { page: currentPage, pageSize: pageSize },
            dataType: 'json',
            success: function (info) {
                var htmlStr = template('productTpl', info);
                $('#productBody').html(htmlStr);

                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion: 3,//默认是2，如果是bootstrap3版本，这个参数必填
                    currentPage: currentPage,//当前页
                    totalPages: Math.ceil(info.total / pageSize),//总页数
                    size: "small",//设置控件的大小，mini, small, normal,large
                    onPageClicked: function (event, originalEvent, type, page) {
                        currentPage = page;
                        render();
                    },
                    itemTexts: function (type, page, current) {
                        switch (type) {
                            case 'page':
                                return page;
                            case 'next':
                                return '下一页';
                            case 'last':
                                return '尾页';
                            case 'prev':
                                return '上一页';
                            case 'first':
                                return '首页';
                        }
                    },
                    tooltipTitles: function (type, page, current) {
                        switch (type) {
                            case 'page':
                                return '前往第' + page + '页';
                            case 'next':
                                return '下一页';
                            case 'last':
                                return '尾页';
                            case 'prev':
                                return '上一页';
                            case 'first':
                                return '首页';
                        }
                    },
                    useBootstrapTooltip: true
                });

            }
        })
    }

    $('#addBtn').click(function () {
        $('#addModal').modal('show');
        $.ajax({
            type: 'get',
            url: '/category/querySecondCategoryPaging',
            data: { page: 1, pageSize: 100 },
            dataType: 'json',
            success: function (info) {
                var htmlStr = template('dropdownTpl', info);
                $('.dropdown-menu').html(htmlStr);
            }
        })
    })

    $('.dropdown-menu').on('click', 'a', function () {
        var txt = $(this).text();
        $('#dropdownText').text(txt);

        var id = $(this).data('id');
        $('[name="brandId"]').val(id);

        $('#form').data('bootstrapValidator').updateStatus('brandId', 'VALID');
    })

    $("#fileupload").fileupload({
        dataType: "json",
        //e：事件对象
        //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
        done: function (e, data) {

            picArr.unshift(data.result);
            $('#imgBox').prepend('<img width="100px" src="' + data.result.picAddr + '" alt="">');
            if (picArr.length > 3) {
                picArr.pop();
                $('#imgBox img:last-of-type').remove();
            }

            if (picArr.length === 3) {
                $("#form").data('bootstrapValidator').updateStatus('picStatus', 'VALID');
            }
        }
    });


    $('#form').bootstrapValidator({
        //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
        excluded: [],

        //2. 指定校验时的图标显示，默认是bootstrap风格
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

        //3. 指定校验字段
        fields: {
            //校验用户名，对应name表单的name属性
            brandId: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '请选择二级分类'
                    }
                }
            },
            proName: {
                validators: {
                    notEmpty: {
                        message: '请输入商品名称'
                    }
                }
            },
            proDesc: {
                validators: {
                    notEmpty: {
                        message: '请输入商品描述'
                    }
                }
            },
            num: {
                validators: {
                    notEmpty: {
                        message: '请输入商品库存'
                    },
                    //正则校验
                    regexp: {
                        regexp: /^[1-9]\d*$/,
                        message: '商品库存必须是非0开头的数字'
                    }
                }
            },
            size: {
                validators: {
                    notEmpty: {
                        message: '请输入商品尺码'
                    },
                    //正则校验
                    regexp: {
                        regexp: /^\d{2}-\d{2}$/,
                        message: '尺码必须是xx-xx的格式，例如: 20-30'
                    }
                }
            },
            oldPrice: {
                validators: {
                    notEmpty: {
                        message: '请输入商品原价'
                    }
                }
            },
            price: {
                validators: {
                    notEmpty: {
                        message: '请输入商品现价'
                    }
                }
            },
            picStatus: {
                validators: {
                    notEmpty: {
                        message: '请选择三张图片'
                    }
                }
            }
        }

    });

    $("#form").on('success.form.bv', function (e) {
        e.preventDefault();
        var paramsStr = $('#form').serialize();
        paramsStr += '&picAddr1=' + picArr[0].picAddr + '&picName1=' + picArr[0].picName;
        paramsStr += '&picAddr2=' + picArr[1].picAddr + '&picName2=' + picArr[1].picName;
        paramsStr += '&picAddr3=' + picArr[2].picAddr + '&picName3=' + picArr[2].picName;
        $.ajax({
            type: 'post',
            url: '/product/addProduct',
            data: paramsStr,
            dataType: 'json',
            success: function (info) {
                console.log(info)
                if (info.success) {
                    $('#addModal').modal('hide');
                    currentPage = 1;
                    render();
                    $("#form").data('bootstrapValidator').resetForm(true);
                    $('#dropdownText').text('请选择二级分类');
                    picArr = [];
                    $('#imgBox img').remove();
                }
            }
        })
    });

})