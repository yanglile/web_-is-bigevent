$(function () {
  //   调用 getUserInfo() 获取用户的基本信息
  getUserInfo();
  var layer = layui.layer;
  //   监听退出按钮 事件
  $("#btnLogo").on("click", function () {
    layer.confirm("确定退出登录么？", { icon: 3, title: "提示" }, function (
      index
    ) {
      //do something
      // 1. 清除 本地存储
      localStorage.removeItem("token");
      // 2.跳转页面到 登录
      location.href = "/login.html";
      // 关闭时询问
      layer.close(index);
    });
  });
});
// 获取用户的基本信息

function getUserInfo() {
  // 获取用户的基本信息
  $.ajax({
    type: "GET",
    url: "/my/userinfo",
    //   请求头
    headers: {
      Authorization: localStorage.getItem("token") || "",
    },
    success: function (res) {
      console.log(res);
      if (res.status !== 0) {
        return layui.layer.msg("获取用户信息失败");
      }
      // 调用 渲染用户头像函数
      renderAvatar(res.data);
    },
    // 无论登录成功还是失败 最终 返回 complete 回调函数
    // complete: function (res) {
    //     console.log("执行了 complete 回调：");
    //   console.log(res);
    //   // 在回调函数中 使用 responseJSON 获取 数据
    //   if (
    //     res.responseJSON.status === 1 &&
    //     res.responseJSON.message === "身份认证失败！"
    //   ) {
    //     // 1. 清除 本地存储
    //     localStorage.removeItem("token");
    //     // 2.跳转页面到 登录
    //     location.href = "/login.html";
    //   }
    // },
    // 不论成功还是失败，最终都会调用 complete 回调函数
    // complete: function (res) {
    //   // console.log('执行了 complete 回调：')
    //   // console.log(res)
    //   // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
    //   if (
    //     res.responseJSON.status === 1 &&
    //     res.responseJSON.message === "身份认证失败！"
    //   ) {
    //     // 1. 强制清空 token
    //     localStorage.removeItem("token");
    //     // 2. 强制跳转到登录页面
    //     location.href = "/login.html";
    //   }
    // },
  });
}
//   渲染用户头像
function renderAvatar(user) {
  // 获取用户的名称
  var name = user.nickname || user.username;
  // 设置欢迎的文本
  $("#welcome").html("欢迎&nbsp;&nbsp" + name);
  // 按需求渲染用户的头像
  if (user.user_pic !== null) {
    $(".layui-nav-img").attr("src", user.user_pic).show();
    $(".text-avatar").hide();
  } else {
    // 渲染文本头像
    $(".layui-nav-img").hide();
    var first = name[0].toUpperCase();
    $(".text-avatar").html(first).show();
  }
}
