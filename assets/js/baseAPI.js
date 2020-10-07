// 每次调用$get , $.ajax, $.post  调用函数
$.ajaxPrefilter(function(options) {
   
    options.url = "http://ajax.frontend.itheima.net" + options.url;
     console.log(options.url);
})