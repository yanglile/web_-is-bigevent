
$(function() {
    var layer = layui.layer ;
    var form = layui.form;
    initArtCateList()
    // 获取文章分类的列表
function initArtCateList(){
    $.ajax({
        type: "GET",
        url: "/my/article/cates",
        success: function (res) {
            console.log(res);
        //    模板引擎
        var htnlStr = template('tpl-tbody',res)
        $('tbody').html(htnlStr)
        }
    });
}

var indexCate = null ;
// 给添加类别按钮 绑定点击事件
$('#btnAddCate').on('click',function() {
indexCate=layer.open({
    title:"添加文章分类",
  type: 1, 
  area: ['500px', '300px'],
  content: $('#tpl-AddCate').html() //这里content是一个普通的String
});
})
// 通过事件委托事件 绑定submit 事件
$('body').on('submit','#form-add',function(e) {
    e.preventDefault();
    $.ajax({
        type: "POST",
        url: "/my/article/addcates",
        data: $(this).serialize(),
        success: function (res) {
            if(res.status !==0) {
                return layer.msg('新增文章分类失败！')
            }
            layer.msg('新增文章分类成功！')
                initArtCateList()
              //如果你想关闭最新弹出的层，直接获取layer.index即可
                 layer.close(indexCate); 
        }
    });
})

var indexAdd = null ;
// 使用事件委托 绑定修改事件
$('body').on('click','#btn_edim' ,function() {
   indexAdd =  layer.open({
    title:"修改文章分类",
  type: 1, 
  area: ['500px', '300px'],
  content: $('#dialog-edit').html() //这里content是一个普通的String
});
//  获取编辑器 id 
var id = $(this).attr('data-id');
// 发起请求获取对应分类的数据
$.ajax({
    type: "GET",
    url: "/my/article/cates/"+id,
    success: function (res) {
    //    快速给表单填充数据
    form.val('form-edit',res.data)
    }
});
})

// 给修改按钮 绑定 submit事件

$('body').on('submit','#form-edit',function(e) {
    e.preventDefault();
    $.ajax({
        type: "POST",
        url: "/my/article/updatecate",
        data: $(this).serialize(),
        success: function (res) {
            if(res.status !==0) {
                return layer.msg('更新分类信息失败！')
            }
            layer.msg('更新分类信息成功！')
            // 关闭弹出框
            layer.close(indexAdd);
            initArtCateList()
        }
    });
})

// 使用事件委托 给删除事件  绑定 点击事件
$('body').on('click','#btn_delete',function() {
    // e.preventDefault();
    var id = $(this).attr('data-id')
    layer.confirm('确定删除么?', {icon: 3, title:'提示'}, function(index){
   $.ajax({
        type: "GET",
        url: "/my/article/deletecate/"+id,
        success: function (res) {
           if(res.status !==0) {
               return layer.msg('删除分类失败！')
           } 
           layer.msg('删除分类成功！')
            initArtCateList()

        }
    });
  
  layer.close(index);
});
   
})
})
