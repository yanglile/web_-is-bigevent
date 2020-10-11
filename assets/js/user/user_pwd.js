$(function () {
  //     - 导入 form 模块
  // - 利用 form.verify()  来定义规则
  //   - 长度必须是6到12位
  //   - 不能与旧密码一致
  //   - 两次密码是否相同
  // - 在对应的表单元素中，利用 lay-verify 来设置自定义校验规则
  var form = layui.form;
  form.verify({
    pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
    samePwd: function (value) {
        if(value===$('[name=oldPwd]').val()){
            return '新密码和原密码不能相同'
        }
    },
    rePwd:function(value) {
        if(value !== $('[name=newPwd]').val()) {
            return '两次密码不一致'
        }
    }
  });
 
// 获取重置 数据请求
$(".layui-form").on('submit',function(e) {
    e.preventDefault();
    $.ajax({
      type: "POST",
      url: "/my/updatepwd",
      data: $(this).serialize(),
      success: function (res) {
          if(res.status !==0) {
              return layui.layer.msg('更新密码失败！')
          }
          layui.layer.msg("更新密码成功！两秒后重新登录");
          $(".layui-form")[0].reset();
          setTimeout(function(){
              window.parent.location.href= '/login.html'
          },2000)
      },
    });
});
  
});
