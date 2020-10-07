$(function () {
  $("#link_reg").on("click", function () {
    $(".login-box").hide();
    $(".reg-box").show();
  });
  $("#link_login").on("click", function () {
    $(".login-box").show();
    $(".reg-box").hide();
  });

  //   校验方式
  //   在layUI 中 获取 form
  var form = layui.form;
  var layer = layui.layer;
  form.verify({
    // 自定义一个 属性 pwd
    pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
    // 通过形参拿到的是确认密码框中的内容
    // 还需要拿到密码框中的内容
    // 然后进行一次等于的判断
    // 如果判断失败,则return一个提示消息即可
    repwd: function (value) {
      var pwd = $(".reg-box [name=password]").val();
      if (value !== pwd) {
        return "两次输入密码不一致";
      }
    },
  });
 
  // 获取注册提交数据
  $("#form_reg").on("submit", function (e) {
    e.preventDefault();
     var data = {
       username: $("#form_reg [name =username ]").val(),
       password: $("#form_reg [name = password]").val(),
     };
    $.ajax({
      type: "POST",
      url: "/api/reguser",
      data: data,
      success: function (res) {
        if (res.status !== 0) return layer.msg(res.message);
        layer.msg("注册成功");
        //  模拟跳转
        $("#link_login").click();
      },
    });
  });

  // 获取登录模块
  $("#form_login").submit(function (e) {
    e.preventDefault();
    $.ajax({
      type: "POST",
      url: "/api/login",
      data: $(this).serialize(),
      success: function (res) {
        console.log(res);
        if (res.status !== 0) return layer.msg(res.message);
        layer.msg("登录成功!");
        // 将登录成功得到的 token 字符串，保存到 localStorage 中
        localStorage.setItem("token", res.token);
        // 跳转页面
        location.href = "/index.html";
      },
    });
  });
});
