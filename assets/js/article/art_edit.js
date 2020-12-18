$(function() {

    // 想从文章列表页面，然后点编辑按钮把文章id获取到本页面，但是不知道跨页面怎么获取id,即不知道怎么传参数
    // 参考老师的那个完整项目是用了  
    // 通过 URLSearchParams 对象，获取 URL 传递过来的参数
    /* var params = new URLSearchParams(location.search)
    var artId = params.get('id') */



    function initArticle(id) {
        $.ajax({
            method: 'GET',
            url: '/my/article/' + id,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章失败')
                }

            }
        })
    }
})