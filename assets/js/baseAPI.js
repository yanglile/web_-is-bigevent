// 每次调用$get , $.ajax, $.post  调用函数
$.ajaxPrefilter(function(options) {
   
    options.url = "http://ajax.frontend.itheima.net" + options.url;
     console.log(options.url);

    //  统一配置有权限的接口
    // 判断是否是有权限接口
    if (options.url)
      options.headers = {
        Authorization: localStorage.getItem("token") || "",
      };

    //   全局统一挂载 回调函数
    options.complete = function(res) {
         if (
        res.responseJSON.status === 1 &&
        res.responseJSON.message === "身份认证失败！"
      ) {
        // 1. 清除 本地存储
        localStorage.removeItem("token");
        // 2.跳转页面到 登录
        location.href = "/login.html";
      }
    
    }
})