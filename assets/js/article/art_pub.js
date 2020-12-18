$(function() {
    var layer = layui.layer;
    var form = layui.form;

    initCate();
    // 初始化富文本编辑器
    initEditor()


    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！')
                }
                // 调用模板引擎，渲染分类的下拉菜单
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                // 一定要记得调用 form.render() 方法
                form.render();
            }
        })
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


    // 为选择封面的按钮绑定点击事件
    $('#btnChooseImage').on('click', function() {
            $('#coverFile').click();
        })
        // 监听文件选择框coverFile的 change事件
    $('#coverFile').on('change', function(e) {
        // 获取文件的列表数组
        var files = e.target.files;
        if (files.length === 0) {
            return layer.msg('您没有选择任何文件');
        }
        // 根据选择的文件，创建一个对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0]);
        // 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 定义文章的发布状态
    var art_state = '已发布';
    // 为草稿按钮绑定点击事件
    $('#btnSave2').on('click', function() {
        art_state = '草稿'
    });
    // 为发布按钮绑定点击事件
    $('#btnSave1').on('click', function() {
        art_state = '已发布'
    })


    // 为表单绑定submit提交事件
    $('#form-pub').on('submit', function(e) {
        // 1. 阻止表单的默认提交行为
        e.preventDefault();
        // 2. 基于form表单，快速创建一个 FormData对象
        var fd = new FormData($(this)[0]);
        // 3. 将文章的发布状态，存到fd中
        fd.append('state', art_state);

        // console.log(fd);
        /* fd.forEach(function(v, k) {
            console.log(k, v)
        });*/

        // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 5. 将文件对象，存储到fd中
                fd.append('cover_img', blob);
                // 6. 发起ajax数据请求
                publishArticle(fd)
            })
    })



    // 定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是 FormData格式的数据，必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发表文章失败!')
                }
                layer.msg('发表文章成功!');
                // 发表文章成功之后，跳转到文章列表页面
                location.href = '/article/art_list.html'
            }
        })
    }

})