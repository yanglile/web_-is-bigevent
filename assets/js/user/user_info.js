$(function () {
  var form = layui.form;
  var layer = layui.layer;

  form.verify({
    nickname: function (value) {
      if (value.length > 6) {
        return "昵称长度必须1~6之间";
      }
    },
  });
  initUserInfo();
  // 初始化用户的基本信息
  function initUserInfo() {
    $.ajax({
      type: "GET",
      url: "/my/userinfo",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取用户基本信息失败！");
        }
        //    layer.msg("获取用户基本信息成功！");
        console.log(res);
        form.val("formUserInfo", res.data);
      },
    });
  }

  //   重置表单内容
  $("#btnReset").on("click", function (e) {
    e.preventDefault();
    // 重新初始化 页面
    initUserInfo();
  });

  // 监听表单的提交事件  
  $(".layui-form").on('submit',function(e) {
    e.preventDefault();
    $.ajax({
      type: "POST",
      url: "/my/userinfo",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("修改用户信息失败！");
        }
        layer.msg("修改用户信息成功！");
        // 调用父页面中的方法，重新渲染用户的头像和用户的信息
        window.parent.getUserInfo();
      },
    });
  });
});

