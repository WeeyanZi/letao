$(function () {
    var key = 'search_list';

    render();

    function render() {
        var htmlStr = template('historyTpl', { arr: getHistory() });
        $('.lt_history').html(htmlStr);
    }

    function getHistory() {
        var history = localStorage.getItem(key) || '[]';
        var arr = JSON.parse(history);
        return arr;
    }

    $('.lt_history').on('click', '.btn_empty', function () {
        mui.confirm('你确定要清空历史记录吗？', '温馨提示', ['取消', '确认'], function (e) {
            if (e.index === 1) {
                localStorage.removeItem(key);
                render();
            }
        });
    });

    $('.lt_history').on('click', '.btn_del', function () {
        var that = this;
        mui.confirm('你确定要删除该条记录吗？', '温馨提示', ['取消', '确认'], function (e) {
            if (e.index === 1) {
                var index = $(that).data('index');
                var arr = getHistory();
                arr.splice(index, 1);
                localStorage.setItem(key, JSON.stringify(arr));
                render();
            }
        });
    });

    $('.search_btn').click(function () {
        var val = $('.search_input').val().trim();
        if (val === '') {
            mui.toast('请输入搜索关键字',{ duration:2000 });
            return;
        }
        var arr = getHistory();

        var index = arr.indexOf(val);
        if (index != -1) {
            arr.splice(index, 1);
        }
        if (arr.length >= 10) {
            arr.pop();
        }
        arr.unshift(val);

        localStorage.setItem(key, JSON.stringify(arr));
        // render();
        $('.search_input').val('');

        location.href = 'searchList.html?key=' + val;
    })

})