$(function() {
    var layer =  layui.layer;
    // 1.1 获取裁剪区域的 DOM 元素
var $image = $('#image')
// 1.2 配置选项
const options = {
  // 纵横比
  aspectRatio: 1,
  // 指定预览区域
  preview: '.img-preview'
}

// 1.3 创建裁剪区域
$image.cropper(options)

// 上传按钮 绑定点击事件
    $('#btnChooesImage').on('click',function() {
        $('#file').click()
    })

    // 给文件选择框添加 change 事件
    $('#file').on('change',function(e){
        // console.log(e);
        // 获取用户选择的文件
        var fileList = e.target.files;
        if(fileList.length ==0) {
            return layer.msg('请选择图片')
        }
         // 1. 拿到用户选择的文件
  var file = e.target.files[0]
  // 2. 将文件，转化为路径
  var imgURL = URL.createObjectURL(file)
  // 3. 重新初始化裁剪区域
  $image
    .cropper('destroy') // 销毁旧的裁剪区域
    .attr('src', imgURL) // 重新设置图片路径
    .cropper(options) // 重新初始化裁剪区域
    })

    // 给确定按钮添加点击事件
    $('#btnUplaod').on('click',function() {
        var dataURL = $image
      .cropper('getCroppedCanvas', {
        // 创建一个 Canvas 画布
        width: 100,
        height: 100
      })
      .toDataURL('image/png')
       $.ajax({
        type: "POST",
        url: "/my/update/avatar",
        data: {
            avatar:dataURL
        },
        success: function (res) {
            if(res.status !==0) {
                return layer.msg('更新头像失败！')
            }
            layer.msg('更新头像成功！')
            // 重新渲染页面
            window.parent. getUserInfo()
        }
    });
    })

   
})