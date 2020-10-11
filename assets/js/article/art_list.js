$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1,  // 默认页码值
        pagesize: 2, //每页显示多少条数据
        cate_id: '',  //文章分类的 Id
        state: '',  // 文章的状态
    }
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    initTable()
    initCate()
    // 获取文章分类的方法
    function initTable() {
        $.ajax({
            type: "GET",
            url: "/my/article/list",
            data: q,
            success: function (res) {
                // console.log(res);
                // res = {
                //     "status": 0,
                //     "message": "获取文章列表成功！",
                //     "data": [
                //         {
                //             "Id": 1,
                //             "title": "abab",
                //             "pub_date": "2020-01-03 12:19:57.690",
                //             "state": "已发布",
                //             "cate_name": "最新"
                //         },
                //         {
                //             "Id": 2,
                //             "title": "666",
                //             "pub_date": "2020-01-03 12:20:19.817",
                //             "state": "已发布",
                //             "cate_name": "股市"
                //         }
                //     ],
                //     "total": 5
                // }
                if (res.status !== 0) {
                    return layer.msg('获取文章列表！')
                }

                // 模板引擎
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr)

                // 当页面加载完成后 调用分页方法
                renderPage(res.total)
            }
        });
    }

    // 分类模块 获取方法 // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败！')
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 通过 layui 重新渲染表单区域的UI结构
                form.render();
            }
        });
    }

    //  赛选绑定 submit 事件
    $('#formSearch').on('submit', function (e) {
        e.preventDefault();
        // 获取表单内容
        var cate_id = $('[name = cate_id]').val();
        var state = $('[name=state]').val();
        // 赋值为数组对象中 q 的值
        q.cate_id = cate_id;
        q.state = state;
        // 再次渲染页面
        initTable()

    })


    // 定义渲染 分页的方法 当页面加载数据调用 renderPage 方法

    function renderPage(total) {
        laypage.render({
            elem: 'pageBox' ,//注意，这里的 test1 是 ID，不用加 # 号
             count:total ,//数据总数，从服务端得到
            limit: q.pagesize, // 每页显示多少条数据
            curr: q.pagenum ,  // 默认页码值
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip', 'refresh'],
            limits :[2,3,5,10],
            // 页面发送切换时 触发 回弹函数 jump
            // 调用laypage.render（）方法就会 调用 jump
            
            jump: function (obj,first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // 把最新的页码值 赋值给 q 查询参数对象
            //    通过first 的值， 来判断是通过 哪种方式，触发 jump 回调
            // 如果 first 的值为true 证明是 方式 2 触发
            // 否则就是方式1 触发

                // 把最新的条目值  q 赋值给 新的数码值 q.pagesize
                q.pagesize = obj.limit;
                q.pagenum = obj.curr;
                // 根据最新的q查询参数对象，再渲染
                // initTable()
                if(!first) {
               
                initTable()

                }
            }
        });
    }

    // 使用事件委托 给 删除按钮 添加点击事件
    $('body').on('click','.btn-delet',function() {
        var id = $(this).attr('data-id');
        // 获取 删除按钮的个数
        var len = $('.btn-delet').length
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                type: "GET",
                url: "/my/article/delete/" + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败！')
                    }
                    layer.msg('删除成功！')
                  
                    // 当len 等于 1 的时候 减去1 页面就没有内容了
                    // 页码值 必须最小是1
                    if( len ==1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum-1 ;
                    }
                    initTable()
                }
            });

            layer.close(index);
        });
    })
})