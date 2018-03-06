var fs = require('fs')


var blogFilePath = 'db/blog.json'


// 这是一个用来存储 Blog 数据的对象
const ModelBlog = function(form) {
    this.title = form.title || ''
    this.author = form.author || ''
    this.content = form.content || ''
    this.cls = form.cls || ''
    this.created_time = Math.floor(new Date() / 1000)
}

const loadBlogs = function() {
    var content = fs.readFileSync(blogFilePath, 'utf8')
    var blogs = JSON.parse(content)
    return blogs
}

var b = {
    data: loadBlogs()
}

b.all = function() {
    var blogs = this.data
    return blogs
}

b.new = function(form) {
    var m = new ModelBlog(form)
    // console.log('new blog', form, m)
    // 设置新数据的 id
    var d = this.data[this.data.length-1]
    if (d == undefined) {
        m.id = 1
    } else {
        m.id = d.id + 1
    }
    // 把 数据 加入 this.data 数组
    this.data.push(m)
    // 把 最新数据 保存到文件中
    this.save()
    // 返回新建的数据
    return m
}

// 分页函数
b.pageAll = function (pno) {
    var index = []
    // 博文的数量
    var blogs = this.data
    var num = blogs.length
    // 总页数
    var totalPage = 0
    // 每一页几篇文章
    var pgSize = 2
    // 现在是第几页
    var currentPage = pno
    // 总共分几页
    // parseInt是取整用的 不是四舍五入 只取整数
    if (num / pgSize > parseInt(num / pgSize)){
        totalPage = parseInt(num / pgSize) + 1
    }else{
        totalPage = parseInt(num / pgSize)
    }
    for (var i = 0; i < totalPage; i++) {
        var start = pgSize * (pno - 1)
        var end = pgSize * pno - 1
        for (var i = 0; i < blogs.length; i++){
            var blog = blogs[i]
            var id = blog.id - 1
            if (id >= start && id <= end){
                // console.log('符合要求的blog是什么', blog)
                index.push(blog)
            }
        }
    }
    return index
}

b.pageClsBar = function (status) {
    var index = []
    var blogs = this.data
    // 先进行分类
    for (var i = 0; i < blogs.length; i++){
        var blog = blogs[i]
        if (status == '100'){
            index.push(blog)
        }
        // 如果类别为生活
        if (status =='101' && blog.cls == '生活'){
            index.push(blog)
        }
        // 如果类别为技术
        if (status == '102' && blog.cls == '技术'){
            index.push(blog)
        }
        // 如果类别为文化
        if (status == '103' && blog.cls == '文化'){
            index.push(blog)
        }
    }
    return index
}

// 筛选类别并分页
b.pageCls = function (status, pno) {
    var index = []
    var blogs = this.data
    // 先进行分类
    for (var i = 0; i < blogs.length; i++){
        var blog = blogs[i]
        // 如果类别为所有分类
        if (status == '100'){
            index.push(blog)
        }
        // 如果类别为生活
        if (status =='101' && blog.cls == '生活'){
            index.push(blog)
        }
        // 如果类别为技术
        if (status == '102' && blog.cls == '技术'){
            index.push(blog)
        }
        // 如果类别为文化
        if (status == '103' && blog.cls == '文化'){
            index.push(blog)
        }
    }
    // 再进行分页
    var index1 = []
    var blogsCls = index
    var num = blogsCls.length
    var totalPage = 0
    // 每一页几篇文章
    var pgSize = 2
    // 现在是第几页
    var currentPage = pno
    // 总共分几页
    // parseInt是取整用的 不是四舍五入 只取整数
    if (num / pgSize > parseInt(num / pgSize)){
        totalPage = parseInt(num / pgSize) + 1
    }else{
        totalPage = parseInt(num / pgSize)
    }
    for (var i = 0; i < totalPage; i++) {
        var start = pgSize * (pno - 1)
        var end = pgSize * pno - 1
        for (var i = 0; i < blogsCls.length; i++){
            var blog = blogsCls[i]
            if (i >= start && i <= end){
                // console.log('符合要求的博文是', blog)
                index1.push(blog)
            }
        }
    }
    return index1
}



// 它能够删除指定 id 的数据
// 删除后保存修改到文件中
b.delete = function(id) {
    var blogs = this.data
    var found = false
    for (var i = 0; i < blogs.length; i++) {
        var blog = blogs[i]
        if (blog.id == id) {
            found = true
            break
        }
    }
    // 用 splice 函数删除数组中的一个元素
    // 如果没找到, i 的值就是无用值, 删除也不会报错
    // 所以不用判断也可以
    blogs.splice(i, 1)
    // 不返回数据也行, 但是还是返回一下好了
    return found
}

b.save = function() {
    var s = JSON.stringify(this.data, null, 2)
    fs.writeFile(blogFilePath, s, (err) => {
      if (err) {
          console.log(err)
      } else {
          console.log('保存成功')
      }
    })
}




module.exports = b


