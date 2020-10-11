$(function() {
    var layer = layui.layer;
    var form = layui.form;
    initCate()
    // 初始化富文本编辑器
    initEditor()
    // 定义一个文章分类列表 的函数
    function initCate() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !==0) {
                    return layer.msg('获取文章分类列表失败！')
                }
                // 模板引擎
                var htmlStr = template('tpl-cates',res);
                $('[name=cate_id]').html(htmlStr)
                // 调用 form.render（）方法
                form.render()
            }
        });
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 绑定 选择封面 按钮
    $('#pubImage').on('click',function() {
        $('#coverFile').click()
    })

      // 监听文件按钮 coverFile 的 change 事件，获取用户选择的文件列表
    $('#coverFile').on('change',function(e) {
        // console.log(e.target.files);
        // 拿到用户获取文件列表
        var files = e.target.files;
        // 判断是否为0 如果为0 直接return 出去
        if (files.length ===0) {
            return
        }
        var file = e.target.files[0]
        // 根据文件 创建 URL 的地址
        var newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 给 状态定义一个变量
    var str_state = '发布';
    $('#btn-state').on('click',function() {
        str_state = '存为草稿'
    })

    // 监听form 表单 submit事件
    $('#form-pub').on('submit',function(e) {
        e.preventDefault();
        // 基于表单创建一个 new formData 对象
        var fd = new FormData($(this)[0])
        // 将文章发布的状态崔放到fd 里面
        fd.append('state', str_state)
        // fd.forEach(function(v,k) {
        //     console.log(k,v);
        // })

        // 将裁剪后的图片，输出为文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 将文件对象 存储到 fd 中
                fd.append('cover_img', blob)
                publishArticle(fd)
            })
    })
// 定义一个发表文章的方法
    function publishArticle(fd) {
        $.ajax({
            type: "POST",
            url: "/my/article/add",
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                location.href='/article/art_list.html'
            }
        });
    }
})