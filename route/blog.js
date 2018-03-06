 // ../ 表示上一级目录
const blog = require('../model/blog')


var all = {
    path: '/api/blog/all',
    method: 'get',
    func: function(request, response) {
        // model/blog里面把b导出 里面定义过all new 等方法 这里的all是定义过的方法 并不是自带的方法属性
        // (具体的all这些方法原始在model/comment.js里面有过定义
        var blogs = blog.all()
        var r = JSON.stringify(blogs, null, 2)
        response.send(r)
    }
}

var add = {
    path: '/api/blog/add',
    method: 'post',
    func: function(request, response) {
        // 浏览器发过来的数据我们一般称之为 form (表单)
        var form = request.body
        // 插入新数据并返回
        var b = blog.new(form)
        var r = JSON.stringify(b)
        response.send(r)
    }
}

var pageAll = {
    path: '/api/blog/page/:pno',
    method: 'get',
    func: function (request, response) {
        var pno = Number(request.params.pno)
        var b = blog.pageAll(pno)
        var r = JSON.stringify(b)
        response.send(r)
    }
}

var pageClsBar = {
    path: '/api/blog/pageCls/:status',
    method: 'get',
    func: function (request, response) {
        var status = Number(request.params.status)
        var b = blog.pageClsBar(status)
        var r = JSON.stringify(b)
        response.send(r)
    }
}

var pageCls = {
    path: '/api/blog/pageCls/:status/:pno',
    method: 'get',
    func: function (request, response) {
        var status = Number(request.params.status)
        var pno = Number(request.params.pno)
        var b = blog.pageCls(status, pno)
        var r = JSON.stringify(b)
        response.send(r)
    }
}


// 用 deleteBlog 而不是 delete 是因为 delete 是一个 js 关键字(就像是 function 一样)
var deleteBlog = {
    path: '/api/blog/delete',
    method: 'post',
    func: function(request, response) {
        // 浏览器发过来的数据我们一般称之为 form (表单)
        var form = request.body
        // 删除数据并返回结果
        var success = blog.delete(form.id)
        var result = {
            success: success,
        }
        var r = JSON.stringify(result)
        response.send(r)
    }
}

var routes = [
    all,
    add,
    pageAll,
    pageClsBar,
    pageCls,
]

module.exports.routes = routes
