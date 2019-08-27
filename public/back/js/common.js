


$(document).ajaxStart(function () {
    console.log("ajaxStart在开始一个ajax请求时触发");
    NProgress.start();
});

$(document).ajaxStop(function () {
    console.log("ajaxStart在开始一个ajax请求时触发");
    NProgress.done();
});