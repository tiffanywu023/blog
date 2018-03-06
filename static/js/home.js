// 辅助线函数
var ckXian = function() {
    var body  = document.querySelector('body')
    var style ='<style id="xm" media="screen"> * {outline: 1px red dashed!important} </style>'
    var i = false
    body.addEventListener('keydown', function(event) {
        if (event.keyCode === 77 && event.ctrlKey) {
            if (i) {
                var styletog = document.querySelector('#xm')
                styletog.remove()
                i = false
            } else {
                body.insertAdjacentHTML('afterbegin', style)
                i = true
            }
        }
    })
}() // 加载代码 使用 Ctrl + M 显示参

// log定义
var log = console.log.bind(console)

// select函数定义
var e = function(selector) {
    return document.querySelector(selector)
}

var es = function(selector) {
    return document.querySelectorAll(selector)
}

// 初始化自定义属性
var initCustomProps = function(element, props, type) {
    if (element.props === undefined) {
        element.props = null
    }
}

// 关于ajax部分
// ajax定义
var ajax = function(request) {
    /*
    request 是一个 object, 有如下属性
        method, 请求的方法, string
        url, 请求的路径, string
        data, 请求发送的数据, 如果是 GET 方法则没这个值, string
        callback, 响应回调, function
    */
    var r = new XMLHttpRequest()
    r.open(request.method, request.url, true)
    
    if (request.contentType !== undefined) {
        r.setRequestHeader('Content-Type', request.contentType)
    }
    
    r.onreadystatechange = function(event) {
        if(r.readyState === 4) {
            request.callback(r.response)
        }
    }
    
    if (request.method === 'GET') {
        // r.send() 是向服务器发送请求
        r.send()
    } else {
        r.send(request.data)
    }
}

// 博文载入
var templateBlog = function (blog) {
    var title = blog.title
    var content = blog.content
    var author = blog.author
    var cls = blog.cls
    var id = blog.id
    var d = new Date(blog.created_time * 1000)
    var time = d.toLocaleString()
    var t =  `
        <div class="blogCell show">
            <div class="blogBox">
                <div class="blogTitle">
                    <div class="titleTxt bold" href="/blog/${id}" data-id="${id}">${title}</div>
                </div>
                <div class="blogAuthor">${author}</div>
                <div class="blogCls">分类:${cls}</div>
                <div class="blogTime">${time}</div>
                <div class="blogContent">${content}</div>
                <div class="moreBox">
                    <img class="forwardsButton" src="/img/forward.png">
                    <span class="fold moreSpan">全文</span>
                    <span class="fold hidden">收起</span>
                </div>
            </div>
        </div>
    `
    return t
}

var insertBlog = function (blogs) {
    var html = ''
    for (var i = 0; i < blogs.length; i++){
        var blog = blogs[i]
        var t = templateBlog(blog)
        html += t
        var content = e('.content')
        content.innerHTML = html
    }
}

// 关于ajax的具体功能函数
// 1.首页部分
var blogAll = function () {
    var request = {
        method: 'get',
        url: '/api/blog/all',
        contentType: 'application/json',
        callback: function(response){
            var blogs = JSON.parse(response)
            window.blogs = blogs
            // log('执行blogAll')
            homePage()
            searchArticle()
        }
    }
    ajax(request)
}

// 添加新博文
var blogNew = function (form) {
    var data = JSON.stringify(form)
    var request = {
        method: 'post',
        url: '/api/blog/add',
        data: data,
        contentType: 'application/json',
        callback: function (response) {
        }
    }
    ajax(request)
}

// 所有博文分页
var blogPageAll = function (pno) {
    var request = {
        method: 'get',
        url: `/api/blog/page/${pno}`,
        contentType: 'application/json',
        callback: function (response) {
            var currentContent = JSON.parse(response)
            var blogs = window.blogs
            var index = 1
            insertBlog(currentContent)
            // 这里pno也是整个大函数的参数 故不需要用实参
            pagination(blogs, pno, index, status)
            blogHeightLimit()
            blogCollapse()
            // log('执行blogPageAll分页')
        }
    }
    ajax(request)
}

// 给分类后的博文分页
// 分类后的博文的分页bar
var blogPageClsBar = function (status) {
    request = {
        method: 'get',
        url: `/api/blog/pageCls/${status}`,
        contentType: 'application/json',
        callback: function (response) {
            var contents = JSON.parse(response)
            var pno = 1
            window.contents = contents
            // 分类后的博文的分页后的每一页内容
            blogPageClass(status, pno)
            blogHeightLimit()
            blogCollapse()
        }
    }
    ajax(request)
}

// 分类后的博文的分页后的每一页内容
var blogPageClass = function (status, pno) {
    var request = {
        method: 'get',
        url: `/api/blog/pageCls/${status}/${pno}`,
        contentType: 'application/json',
        callback: function (response) {
            var contentCls = JSON.parse(response)
            var index = 2
            // blogs为这一类的博文内容
            var blogs = window.contents
            window.contentCls = contentCls
            pagination(blogs, pno, index, status)
            insertBlog(contentCls)
            blogHeightLimit()
            blogCollapse()
        }
    }
    ajax(request)
}


// 关于逻辑部分
// 菜单栏点击切换内容
// 0.首页
var homePage = function () {
    var mainBody = e('.mainBody')
    var blogger = `
                <!--首页-->
                <!--左栏-->
                <div class="blogger">
                    <!--左栏内容-->
                    <div class="bloggerBox">
                        <!--头像-->
                        <div class="profilePictureBox">
                            <img class="profilePicture" src="/img/profilePicture.jpeg">
                        </div>
                        <!--信息-->
                        <div class="IdentifyBox">
                            <div class="informationBox">
                                <p class="blue">DIVAN WU</p>
                                <p class="witness blue">witness me</p>
                            </div>
                            <div class="iconBox">
                                <img class="icon" src="/img/twitter.png">
                                <img class="icon" src="/img/git.png">
                                <img class="icon" src="/img/email.png">
                            </div>
                        </div>
                        <div class="articleBox">
                            <p class="articleTitle blue">博文分类</p>
                            <div class="articleMenu">
                                <div class="articleCls blue">所有博文</div>
                                <div class="articleCls blue">生活</div>
                                <div class="articleCls blue">技术</div>
                                <div class="articleCls blue">文化</div>
                            </div>
                        </div>

                    </div>
                </div>
                <!--首页-->
                <!--文章-->
                <div class="articles">
                    <div class="editButton">
                        <img src="/img/edit.png" class="button">
                    </div>
                    <div class="articleList">
                        <div class="content"></div>
                        <div class="Pagination"></div>
                    </div>
                    <div class="writeBlog">
                        <img class="closeButton" src="/img/close.png">
                        <input class="inputTitle" placeholder="请输入博文标题">
                        <input class="inputAuthor" placeholder="请输入博文作者">
                        <div>
                            <span>博文分类</span>
                            <select class="inputOption">
                                <option>生活</option>
                                <option>技术</option>
                                <option>文化</option>
                            </select>
                        </div>
                        <textarea class="inputContent"></textarea>
                        <button class="confirmButton">发布博文</button>
                    </div>
                    <div class="buttonTop">
                        <img class="upButton" src="/img/up.png">
                        <div class="upTxt">TOP</div>
                    </div>
                </div>
    `
    mainBody.innerHTML = blogger
    showWriteBlog()
    // log('写博客执行之前')
    writeBlogContent()
    // log('blogPageAll分页执行之前')
    blogPageAll(1)
    chooseBLogCls()
    backTop()
    // log('执行homepage')
}

// 固定的头部部分
// 把头部做成轮播图
// 轮播图的滑动
var lunpoSlide = function (index) {
    var box = e('.lunpoBox')
    var img = box.children[0]
    var imgLen = window.getComputedStyle(img).height
    // log('高度', imgLen)
    var length = imgLen.slice(0, -2)
    var newIndex = parseInt(index)
    var n = (length) * (newIndex) * (-1)
    var box = e('.lunpoBox')
    box.style.transform = `translateY(${n}px)`
}
// 轮播图小圆点css改变
var circleClsChange = function (index) {
    var circles = es('.circleBox')
    for (var j = 0; j < circles.length; j++){
        var circle = circles[j]
        // log(circle)
        circle.classList.remove('active')
        circles[index].classList.add('active')
    }
}
// 点击圆点切换图片
var lunpoClick = function () {
    var buttons = es('.circleBox')
    for (var i = 0; i < buttons.length; i++){
        var button = buttons[i]
        button.addEventListener('click', function (event) {
            // log('点击了')
            var target = event.target
            var index = parseInt(target.dataset.id)
            // log(index)
            lunpoSlide(index)
            circleClsChange(index)
        })
    }
    // log('执行lunpoClick函数')
}


// 写博文的一系列操作
// 写博文
var writeBlogContent = function () {
    var sendButton = e('.confirmButton')
    sendButton.addEventListener('click', function (event) {
        var form = {
            title: e('.inputTitle').value,
            author: e('.inputAuthor').value,
            content: e('.inputContent').value,
            cls: e('.inputOption').value
        }
        blogNew(form)
    })
    // log('执行写博客函数')
}

// 博文框出现与隐藏
var showWriteBlog = function () {
    var writeButton = e('.button')
    var writeBlog = e('.writeBlog')
    var closeButton = e('.closeButton')
    // 点击写博文按钮
    writeButton.addEventListener('click', function (event) {
        writeBlog.classList.add('show')
    })
    // 点击关闭按钮
    closeButton.addEventListener('click', function (event) {
        writeBlog.classList.remove('show')
    })
}

// 博文的高度限制
var blogHeightLimit = function () {
    var moreBox = es('.moreBox')
    for (var i = 0; i < moreBox.length; i++){
        var more = moreBox[i]
        var blogBox = more.parentElement
        var blogContent = blogBox.children[4]
        var index = window.getComputedStyle(blogContent).height
        var height = index.slice(0, -2)
        log('现在博文高度是什么', height)
        if (height > 350){
            blogContent.style.height = '300px'
            blogContent.style.overflow = 'hidden'
            more.style.display = 'block'
        }
    }
}

// 博文列表点击延伸与收回
var blogCollapse = function () {
    var blackBox = e('.articleList')
    // log('黑框高度', window.getComputedStyle(blackBox).height)
    var menus = es('.articleCls')
    var navs = es('.nav')
    var blog = e('.mainBody')
    var articleBox = e('.articles')
    var index = window.getComputedStyle(blog).height
    var height = parseInt(index.slice(0, -2))
    log('mainBody框的高度', height)
    var extendButtons = es('.forwardsButton')
    for (var i = 0; i < extendButtons.length; i++) {
        var extendButton = extendButtons[i]
        extendButton.addEventListener('click', function (event) {
            var target = event.target
            var parent = target.parentElement
            var grandpa = parent.parentElement
            var blogContent = grandpa.children[4]
            if (!target.classList.contains('rotate')) {
                // 文章高度
                blogContent.style.height = '100%'
                // 图标翻转
                target.classList.add('rotate')
                // 文字变化
                parent.children[1].classList.add('hidden')
                parent.children[2].classList.remove('hidden')
                // 整个大盒子高度
                var txtHeightIndex = window.getComputedStyle(blogContent).height
                log('实际博文高度', window.getComputedStyle(blogContent).height)
                var txtHeight = parseInt(txtHeightIndex.slice(0, -2))
                var xxx = height + txtHeight - 300
                blog.style.height = xxx + 'px'
                articleBox.style.height = xxx + 'px'
                // 文本框（黑框）高度
                // var blackBoxHeightIndex = window.getComputedStyle(blackBox).height
                // var blackBoxHeight = parseInt(blackBoxHeightIndex.slice(0, -2))
                // log('黑框高度', blackBoxHeight, '黑框是什么', blackBox)
                var yyy = 900 + txtHeight - 300
                blackBox.style.height = yyy + 'px'
            } else {
                blogContent.style.height = '300px'
                target.classList.remove('rotate')
                parent.children[1].classList.remove('hidden')
                parent.children[2].classList.add('hidden')
                blog.style.height = '1000px'
                articleBox.style.height = '1000px'
                blackBox.style.height = '90%'
                // log('收回去高度')
            }
        })
    }
    // 其他情况 点击了其他部分也都要为收回的高度
    // 点击菜单
    for (var j = 0; j < menus.length; j++){
        var menu = menus[j]
        menu.addEventListener('click', function (event) {
            blog.style.height = '1000px'
            articleBox.style.height = '1000px'
        })
    }
    // 点击导航栏
    for (var k = 0; k < navs.length; k++){
        var nav = navs[k]
        nav.addEventListener('click', function (event) {
            blog.style.height = '1000px'
            articleBox.style.height = '1000px'
            if (event.target.innerText == '关于我'){
                blog.style.height = '700px'
            }
            if (event.target.innerText == '音乐'){
                blog.style.height = '720px'
            }
        })
    }
}

// 博文分类表的操作
var chooseBLogCls = function () {
    var status = 0
    // var pno = 1
    var articles = es('.blogCell')
    var blogClsMenu = es('.articleCls')
    var blogCls = es('.blogCls')
    for (var i = 0; i < blogClsMenu.length; i++){
        var menu = blogClsMenu[i]
        // 移动特效
        menu.addEventListener('mouseover', function (event) {
            var target = event.target
            target.classList.add('MenuHover')
        })
        menu.addEventListener('mouseout', function (event) {
            var target = event.target
            target.classList.remove('MenuHover')
        })
        // 点击具体分类刷新右边文章列表
        menu.addEventListener('click', function (event) {
            var target = event.target
            // log('点击了啥', event.target)
            if (target.innerText == '所有博文'){
                status = 100
            }
            if (target.innerText == '生活'){
                status = 101
            }
            if (target.innerText == '技术'){
                status = 102
            }
            if (target.innerText == '文化'){
                status = 103
            }
            // log('执行chooseBLogCls,分类函数blogPageClsBar执行之前')
            blogPageClsBar(status)
        })
    }
}

// 搜索栏的一系列操作
// 搜索菜单栏的滑入滑出效果
var searchBlog = function () {
    var state = false
    var searchButton = e('.navigationImg')
    var searchBox = e('.searchBox')
    var shade = e('.shade')
    var mainBody = e('.mainBody')
    // 菜单栏的滑动与滑出{
    searchButton.addEventListener('click', function (event) {
        if (state == false){
            searchBox.classList.add('come')
            searchBox.classList.remove('left')
            state = true
        }
    })
    // 菜单滑入
    mainBody.addEventListener('click', function (event) {
        if (state){
            searchBox.classList.add('left')
            searchBox.classList.remove('come')
            state = false
        }
    })
    shade.addEventListener('click', function (event) {
        if (state){
            searchBox.classList.add('left')
            searchBox.classList.remove('come')
            state = false
        }
    })
    // log('执行searchBlog')
}

// 搜索菜单栏的搜索功能
var searchArticle = function () {
    var blogs = window.blogs
    var searchBox = e('.searchInput')
    var searchButton = e('.searchButton')
    var resultBox = e('.resultBox')
    searchButton.addEventListener('click', function (event) {
        resultBox.innerHTML = ''
        var index = []
        var searchValue = e('.searchInput').value
        for (var i = 0; i < blogs.length; i++){
            var blog = blogs[i]
            var title = blog.title
            var content = blog.content
            if (title.includes(searchValue) || content.includes(searchValue)){
                // 文章内容的参数
                index.push("1");
                var startCon = content.indexOf(searchValue)
                var endCon = startCon + searchValue.length
                var stfContent = content.slice(startCon, endCon)
                var exConStart = content.slice(startCon - 15, startCon)
                var exConEnd = content.slice(endCon, endCon + 15)
                // 标题的参数
                var startTit = title.indexOf(searchValue)
                var endTit = startTit + searchValue.length
                var stfTitle = title.slice(startTit, endTit)
                var exTitStart = title.slice(startTit - 15, startTit)
                var exTitEnd = title.slice(endTit, endTit + 15)
                if(startTit == -1) {
                    var result = `
                    <div class="resultTit">${title}</div>
                    <div>${exConStart}<span class="highlight">${stfContent}</span>${exConEnd}</div>
                    `
                }else {
                    var result = `
                    <div class="resultTit">${exTitStart}<span class="highlight">${stfTitle}</span>${exTitEnd}</div>
                    <div>${exConStart}<span class="highlight">${stfContent}</span>${exConEnd}</div>
                    `
                }
                resultBox.insertAdjacentHTML('beforeEnd', result)
            }
        }
        if (index.length == 0){
            var resultNone = `无搜索结果`
            resultBox.innerHTML = resultNone
        }
    })
    // log('执行searchTitle')
}


// 导航栏的操作
var navigationBlog = function () {
    var navigation = es('.navCenter')
    for (var i = 0; i < navigation.length; i++){
        var nav = navigation[i]
        // 移上移出效果
        nav.addEventListener('mouseover', function (event) {
            event.target.classList.add('hover')
        })
        nav.addEventListener('mouseout', function (event) {
            event.target.classList.remove('hover')
        })
    }
    // log('执行navigationBlog导航栏操作')
}

// 所有博文分栏
// pno是页数（在函数中被设定为当前页数）
// pagination 类函数主要功能是在尾部插入分页器 具体每页的数据已经在前面通过ajax请求过来了
// index是状态码 当index为1时 是给所有文章分页 当index为2时 是给分类后的文章分页
var pagination = function (blogs, pno, index, status) {
    var num = blogs.length
    var pgSize = 2
    var currentPage = pno
    // 一共多少页
    if (num / pgSize > parseInt(num / pgSize)){
        totalPage = parseInt(num / pgSize) + 1
    }else{
        totalPage = parseInt(num / pgSize)
    }
    // 插入页面
    var PaginationBar = e('.Pagination')
    var bar = `
           <span class="blue">共${num}篇博文</span>
           <span class="blue">共${totalPage}页</span>
           <span class="blue">当前第${currentPage}页</span>
    `
    // 状态码为1
    if (index == 1){
        if(currentPage > 1){
            bar += `<a href="#" onClick="blogPageAll(1)">首页</a>`
            bar += `<a href="#" onClick="blogPageAll(${currentPage - 1}) class="blue"><上一页</a>`
        }else{
            bar += `首页`
            bar += '<上一页'
        }
        if (currentPage < totalPage){
            bar += `<a href="#" onClick="blogPageAll(${currentPage + 1})">下一页></a>`
            bar += `<a href="#" onClick="blogPageAll(${totalPage})">尾页</a>`
        }else{
            bar += `下一页>`
            bar += `尾页`
        }
        PaginationBar.innerHTML = bar
    }
    // 状态码为2
    if (index == 2){
        if(currentPage > 1){
            bar += `<a href="#" onClick="blogPageClass(${status}, 1)">首页</a>`
            bar += `<a href="#" onClick="blogPageClass(${status}, ${currentPage - 1})"><上一页</a>`
        }else{
            bar += `首页`
            bar += '<上一页'
        }
        if (currentPage < totalPage){
            console.log('currentPage是什么', currentPage)
            console.log('totalPage是什么', totalPage)
            bar += `<a href="#" onClick="blogPageClass(${status}, ${currentPage + 1})">下一页></a>`
            bar += `<a href="#" onClick="blogPageClass(${status}, ${totalPage})">尾页</a>`
        }else{
            bar += `下一页>`
            bar += `尾页`
        }
        PaginationBar.innerHTML = bar
    }
    
}

// 回到顶部
var backTop = function () {
    var button = e('.buttonTop')
    button.addEventListener('click', function (event) {
        scrollTo(0,0)
    })
}


// 1.关于我
var aboutMe = function () {
    aboutMeHTML()
    aboutMeEcharts()
}
var aboutMeHTML = function () {
    var mainBody = e('.mainBody')
    var album = `
        <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
        <div id="main"></div>
    `
    mainBody.innerHTML = album
}
var aboutMeEcharts = function () {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(e('#main'));
    // 指定图表的配置项和数据
    option = {
        backgroundColor: new echarts.graphic.RadialGradient(0.3, 0.3, 0.8, [{
            offset: 0,
            color: '#fafafa',
        }, {
            offset: 1,
            color: '#efefef',
        }]),
        title: {
            text: "关于我的介绍",
            top: "top",
            left: "center",
            textStyle:{
                //文字颜色
                color:'#2b2b2b',
                //字体风格,'normal','italic','oblique'
                fontStyle: 'normal',
                //字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
                fontWeight:'normal',
                //字体系列
                // fontFamily:'Helvetica',
                //字体大小
                fontSize:16
            }
        },
        tooltip: {},
        legend: [{
            formatter: function(name) {
                return echarts.format.truncateText(name, 40, '14px Microsoft Yahei', '…');
            },
            tooltip: {
                show: true
            },
            selectedMode: 'false',
            bottom: 20,
            data: ['TiffanyWu', '技术栈','个人项目', '社交网络', '个人信息', '爱好']
        }],
        toolbox: {
            show: true,
            feature: {
                dataView: {
                    show: true,
                    readOnly: true
                },
                restore: {
                    show: true
                },
                saveAsImage: {
                    show: true
                }
            }
        },
        animationDuration: 3000,
        animationEasingUpdate: 'quinticInOut',
        series: [{
            name: '关于21的自我介绍',
            type: 'graph',
            layout: 'force',
            force: {
                // 引力
                gravity: 0.08,
                // 默认距离
                edgeLength: 55,
                // 斥力
                repulsion: 95
            },
            data: [{
                "name": "TiffanyWu",
                "symbolSize": 45,
                "draggable": "true",
                "value": 8,
                itemStyle:{
                    normal:{color:'#c23635'}
                }
            }, {
                "name": "技术栈",
                "value": 14,
                "symbolSize": 25,
                "category": "技术栈",
                "draggable": "true",
                // itemStyle:{
                //     normal:{color:'#2f4553'}
                // }
                itemStyle:{
                    normal:{color:'#2f4553'}
                }
    
            }, {
                "name": "HTML5",
                "symbolSize": 10,
                "category": "技术栈",
                "draggable": "true",
                "value": "-"
            }, {
                "name": "CSS3",
                "symbolSize": 10,
                "category": "技术栈",
                "draggable": "true",
                "value": "-"
            }, {
                "name": "JavaScript",
                "symbolSize": 10,
                "category": "技术栈",
                "draggable": "true",
                "value": "-"
            },{
                "name": "ES5",
                "symbolSize": 10,
                "category": "技术栈",
                "draggable": "true",
                "value": "-"
            }, {
                "name": "ES6",
                "symbolSize": 10,
                "category": "技术栈",
                "draggable": "true",
                "value": "-"
            },{
                "name": "Echarts",
                "symbolSize": 10,
                "category": "技术栈",
                "draggable": "true",
                "value": "-"
            },{
                "name": "jQuery",
                "symbolSize": 10,
                "category": "技术栈",
                "draggable": "true",
                "value": "-"
            }, {
                "name": "Vue.js",
                "symbolSize": 10,
                "category": "技术栈",
                "draggable": "true",
                "value": "-"
            }, {
                "name": "Express",
                "symbolSize": 10,
                "category": "技术栈",
                "draggable": "true",
                "value": "-"
            },{
                "name": "Node.js",
                "symbolSize": 10,
                "category": "技术栈",
                "draggable": "true",
                "value": "-"
            },{
                "name": "HTML",
                "symbolSize": 10,
                "category": "技术栈",
                "draggable": "true",
                "value": "-"
            },{
                "name": "flex",
                "symbolSize": 10,
                "category": "技术栈",
                "draggable": "true",
                "value": "-"
            }, {
                "name": "particle.js",
                "symbolSize": 10,
                "category": "技术栈",
                "draggable": "true",
                "value": "-"
            },{
                "name": "bootstrap",
                "symbolSize": 10,
                "category": "技术栈",
                "draggable": "true",
                "value": "-"
            }, {
                "name": "个人项目",
                "value": 7,
                "symbolSize": 25,
                "category": "个人项目",
                "draggable": "true",
                itemStyle:{
                    normal:{color:'#60a0a8'}
                }
            }, {
                "name": "音乐播放器",
                "symbolSize": 10,
                "category": "个人项目",
                "draggable": "true",
                "value": "-"
            }, {
                "name": "Todo清单",
                "symbolSize": 10,
                "category": "个人项目",
                "draggable": "true",
                "value": "-"
            }, {
                "name": "个人博客",
                "symbolSize": 10,
                "category": "个人项目",
                "draggable": "true",
                "value": "-"
            }, {
                "name": "豆瓣电影爬虫",
                "symbolSize": 10,
                "category": "个人项目",
                "draggable": "true",
                "value": "-"
            }, {
                "name": "React相册墙",
                "symbolSize": 10,
                "category": "个人项目",
                "draggable": "true",
                "value": "-"
            }, {
                "name": "轮播图",
                "symbolSize": 10,
                "category": "个人项目",
                "draggable": "true",
                "value": "-"
            },  {
                "name": "淘宝星星评价条",
                "symbolSize": 10,
                "category": "个人项目",
                "draggable": "true",
                "value": "-"
            },{
                "name": "社交网络",
                "value": 6,
                "symbolSize": 25,
                "category": "社交网络",
                "draggable": "true",
                itemStyle:{
                    normal:{color:'#b15f63'}
                }
            }, {
                "name": "Instagram",
                "symbolSize": 10,
                "category": "社交网络",
                "draggable": "true",
                "value": "-"
            }, {
                "name": "微信",
                "symbolSize": 10,
                "category": "社交网络",
                "draggable": "true",
                "value": "-"
            }, {
                "name": "微博",
                "symbolSize": 10,
                "category": "社交网络",
                "draggable": "true",
                "value": "-"
            }, {
                "name": "GitHub",
                "symbolSize": 10,
                "category": "社交网络",
                "draggable": "true",
                "value": "-"
            }, {
                "name": "知乎",
                "symbolSize": 10,
                "category": "社交网络",
                "draggable": "true",
                "value": "-"
            }, {
                "name": "QQ",
                "symbolSize": 10,
                "category": "社交网络",
                "draggable": "true",
                "value": "-"
            }, {
                "name": "个人信息",
                "value": 4,
                "symbolSize": 25,
                "category": "个人信息",
                "draggable": "true",
                // itemStyle:{
                //     normal:{color:'#739e83'}
                // }
                itemStyle:{
                    normal:{color:'#739e83'}
                }
            }, {
                "name": "95后",
                "symbolSize": 10,
                "category": "个人信息",
                "draggable": "true",
                "value": "-"
            }, {
                "name": "天秤座",
                "symbolSize": 10,
                "category": "个人信息",
                "draggable": "true",
                "value": "9.23"
            },{
                "name": "前端程序员",
                "symbolSize": 10,
                "category": "个人信息",
                "draggable": "true",
                "value": "-"
            }, {
                "name": "中国上海",
                "symbolSize": 10,
                "category": "个人信息",
                "draggable": "true",
                "value": "-",
            },  {
                "name": "爱好",
                "value": 8,
                "symbolSize": 25,
                "category": "爱好",
                "draggable": "true",
                itemStyle:{
                    normal:{color:'#dc8f19'}
                }
            }, {
                "name": "数码控",
                "symbolSize": 10,
                "category": "爱好",
                "draggable": "true",
                "value": "-"
            }, {
                "name": "美食控",
                "symbolSize": 10,
                "category": "爱好",
                "draggable": "true",
                "value": "-"
            }, {
                "name": "音乐控",
                "symbolSize": 10,
                "category": "爱好",
                "draggable": "true",
                "value": "-"
            }, {
                "name": "旅行控",
                "symbolSize": 10,
                "category": "爱好",
                "draggable": "true",
                "value": "-"
            }, {
                "name": "电影控",
                "symbolSize": 10,
                "category": "爱好",
                "draggable": "true",
                "value": "-"
            }, {
                "name": "登山控",
                "symbolSize": 10,
                "category": "爱好",
                "draggable": "true",
                "value": "-"
            }, {
                "name": "彩妆控",
                "symbolSize": 10,
                "category": "爱好",
                "draggable": "true",
                "value": "-"
            }, {
                "name": "游戏控",
                "symbolSize": 10,
                "category": "爱好",
                "draggable": "true",
                "value": "-"
            }],
            links: [{
                "source": "TiffanyWu",
                "target": "技术栈",
            }, {
                "source": "技术栈",
                "target": "HTML5"
            }, {
                "source": "技术栈",
                "target": "CSS3"
            }, {
                "source": "技术栈",
                "target": "ES5"
            }, {
                "source": "技术栈",
                "target": "ES6"
            }, {
                "source": "技术栈",
                "target": "JavaScript"
            }, {
                "source": "技术栈",
                "target": "jQuery"
            }, {
                "source": "技术栈",
                "target": "Vue.js"
            }, {
                "source": "技术栈",
                "target": "Express"
            }, {
                "source": "技术栈",
                "target": "Node.js"
            },{
                "source": "技术栈",
                "target": "Echarts"
            }, {
                "source": "技术栈",
                "target": "HTML"
            }, {
                "source": "技术栈",
                "target": "bootstrap"
            },  {
                "source": "技术栈",
                "target": "flex"
            }, {
                "source": "技术栈",
                "target": "particle.js"
            }, {
                "source": "TiffanyWu",
                "target": "个人项目"
            }, {
                "source": "个人项目",
                "target": "音乐播放器"
            }, {
                "source": "个人项目",
                "target": "Todo清单"
            }, {
                "source": "个人项目",
                "target": "个人博客"
            }, {
                "source": "个人项目",
                "target": "豆瓣电影爬虫"
            }, {
                "source": "个人项目",
                "target": "React相册墙"
            }, {
                "source": "个人项目",
                "target": "轮播图"
            }, {
                "source": "个人项目",
                "target": "淘宝星星评价条"
            }, {
                "source": "TiffanyWu",
                "target": "社交网络"
            }, {
                "source": "社交网络",
                "target": "Instagram"
            }, {
                "source": "社交网络",
                "target": "微博"
            }, {
                "source": "社交网络",
                "target": "微信"
            }, {
                "source": "社交网络",
                "target": "GitHub"
            }, {
                "source": "社交网络",
                "target": "知乎"
            }, {
                "source": "社交网络",
                "target": "QQ"
            }, {
                "source": "TiffanyWu",
                "target": "个人信息"
            }, {
                "source": "个人信息",
                "target": "95后"
            }, {
                "source": "个人信息",
                "target": "天秤座"
            }, {
                "source": "个人信息",
                "target": "中国上海"
            }, {
                "source": "个人信息",
                "target": "前端程序员"
            }, {
                "source": "TiffanyWu",
                "target": "爱好"
            }, {
                "source": "爱好",
                "target": "数码控"
            }, {
                "source": "爱好",
                "target": "美食控"
            }, {
                "source": "爱好",
                "target": "音乐控"
            }, {
                "source": "爱好",
                "target": "旅行控"
            }, {
                "source": "爱好",
                "target": "电影控"
            }, {
                "source": "爱好",
                "target": "登山控"
            }, {
                "source": "爱好",
                "target": "彩妆控"
            },{
                "source": "爱好",
                "target": "游戏控"
            }],
            categories: [{
                'name': 'TiffanyWu',
                itemStyle:{
                    normal:{color:'#c23635'}
                }
            }, {
                'name': '技术栈',
                itemStyle:{
                    normal:{color:'#2f4553'}
                }
    
            }, {
                'name': '个人项目',
                itemStyle:{
                    normal:{color:'#60a0a8'}
                }
            }, {
                'name': '社交网络',
                itemStyle:{
                    normal:{color:'#b15f63'}
                }
            }, {
                'name': '个人信息',
                itemStyle:{
                    normal:{color:'#739e83'}
                }
            }, {
                'name': '爱好',
                itemStyle:{
                    normal:{color:'#dc8f19'}
                }
            }],
            focusNodeAdjacency: true,
            roam: true,
            label: {
                normal: {
                    show: true,
                    position: 'top',
                }
            },
            lineStyle: {
                normal: {
                    color: 'source',
                    curveness: 0,
                    type: "solid"
                }
            }
        }]
    };
    // // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option)
}

// 2.音乐
var songList = [{
    name:'Style',
    singer:'Taylor Swift',
    duration:'03:51',
    album:'《1989》',
    music:'Style.mp3',
    imgPath:'TaylorSwift.jpg'
},{
    name:'NewRomantics',
    singer:'Taylor Swift',
    album:'《1989》',
    duration:'03:50',
    music:'NewRomantics.mp3',
    imgPath:'1989.jpeg'
},{
    name:'NoMoney',
    singer:'Galantis',
    duration:'03:09',
    album:'《No Money》',
    music:'NoMoney.mp3',
    imgPath:'NoMoney.jpeg'
},{
    name:'大艺术家',
    singer:'蔡依林',
    duration:'03:17',
    album:'《大艺术家》',
    music:'大艺术家.mp3',
    imgPath:'大艺术家.jpg'
},{
    name:'齐天',
    singer:'华晨宇',
    duration:'04:47',
    album:'《齐天》',
    music:'齐天.mp3',
    imgPath:'齐天.jpeg'
},{
    name:'Brandy',
    singer:'Looking Glass',
    duration:'03:06',
    album:'《Brandy》',
    music:'Brandy.mp3',
    imgPath:'brandy.jpeg'
},{
    name:'HadMyDoubts',
    singer:'Jeff Beal',
    duration:'02:16',
    album:'《House Of Cards: Season 4》',
    music:'HadMyDoubts.mp3',
    imgPath:'HadMyDoubts.jpeg'
},{
    name:'Dollhouse',
    singer:'MelanieMartinez',
    duration:'03:52',
    album:'《Dollhouse EP》',
    music:'Dollhouse.mp3',
    imgPath:'Dollhouse.jpeg'
},{
    name:'赌局',
    singer:'椎名林檎',
    duration:'05:50',
    album:'《平成風俗》',
    music:'赌局.mp3',
    imgPath:'椎名林檎.jpeg'
},{
    name:'TheCure',
    singer:'Lady GAGA',
    duration:'03:31',
    album:'《The Cure》',
    music:'TheCure.mp3',
    imgPath:'thecure.jpeg'
},]

var wayList = [{
    name:'loop',
    imgPath:'loop.png'
},{
    name:'singleLoop',
    imgPath:'singleLoop.png'
},{
    name:'random',
    imgPath:'random.png'
}]

var music = function () {
    var mainBody = e('.mainBody')
    var music =  `
        <audio class="player" data-id="0">
            <source src="/music/Style.mp3">
        </audio>
        <div class="musicBackground"></div>
        <!--头部播放信息-->
        <div class="musicHead">
            <span class="playing">正在播放：Style - Taylor Swift</span>
        </div>
        <div class="musicLeft">
            <div class="musicCd">
                <!--唱片机部分-->
                <div class="cdBox">
                    <div class="cdBoxImg">
                        <img class="cd" src="/img/cd.png">
                        <div class="cdShadow"></div>
                        <div class="con">
                            <img class="albumImg" src="/img/TaylorSwift.jpg">
                        </div>
                    </div>
                    <div class="cdNeedle">
                        <img class="needle" src="/img/needle.png">
                    </div>
                </div>
                <!--音乐介绍-->
                <div class="musicIntro">
                    <div class="musicTit">Style</div>
                    <div class="musicSinger">Taylor Swift</div>
                    <div class="musicAlbum">专辑：《1989》</div>
                </div>
                <!--底部四个按钮-->
                <div class="musicButton">
                    <span class="musicNav">
                        <span class="navFont">喜欢</span>
                    </span>
                    <span class="musicNav">
                        <span class="navFont">收藏</span>
                    </span>
                    <span class="musicNav">
                        <span class="navFont">分享</span>
                    </span>
                    <span class="musicNav">
                        <span class="navFont">下载</span>
                    </span>
                </div>
            </div>
        </div>
        <div class="musicRight">
            <div class="librettoBox">
                <div class="libretto">
                    <div class="songsTit">
                        <div class="songTit">播放列表</div>
                    </div>
                    <div class="songsCon">
                        <div class="songNameBox"></div>
                        <div class="singerBox"></div>
                        <div class="totalTimeBox"></div>
                    </div>
                </div>
            </div>
        </div>
        <!--底部播放条-->
        <div class="musicPlay">
            <!--音乐控制-->
            <div class="musicControl">
                <div class="pre">
                    <img class="preIcon" src="/img/nextMusic.png">
                </div>
                <div class="play">
                    <img class="playIcon pause" src="/img/play.png">
                </div>
                <div class="next">
                    <img class="nextIcon" src="/img/nextMusic.png">
                </div>
            </div>
            <div class="musicProgressBar">
                <div class="inputBox">
                    <input class="input" type="range" value="0" min="0" max="100" step="0.1">
                </div>
            </div>
            <div class="timeBar">
                <div class="timePercent">0:00/3:50</div>
            </div>
            <div class="musicVol">
                <div class="volIconBox">
                    <img class="volIcon" src="/img/vol.png">
                </div>
                <div class="volConBox">
                    <input class="vol" type="range" value="0.6" min="0" max="1" step="0.01">
                </div>
            </div>
            <div class="musicWay">
                <div class="wayIcon">
                    <img class="way" data-id="0" src="/img/loop.png">
                </div>
            </div>
        </div>
    `
    mainBody.innerHTML = music
    musicWayChangeStyle()
    musicProgress()
    musicVol()
    musicPlay()
    musicList()
    autoNext()
    musicNext()
    musicPre()
    musicListCSS()
    selectSong()
}

// 播放音乐
var play = function () {
    var player = e('.player')
    player.play()
}
// 暂停音乐
var pause = function () {
    var player = e('.player')
    player.pause()
}

// 进度条
var musicProgress = function () {
    musicTimeChange()
    progressChange()
}
// 进度条样式变化
var progressChangeStyle = function () {
    var input = e('.input')
    var player = e('.player')
    // 百分比
    var musicTime = player.currentTime / player.duration * 100
    //改变input range的值
    if (isNaN(player.duration)){
        input.value = 0
    }else{
        input.value = musicTime
    }
    // 改变进度条的CSS
    var percent = input.value + '%'
    input.style.backgroundSize = percent + '100%'
}
// 移动进度条歌曲和样式发生改变
var musicTimeChange = function () {
    var player = e('.player')
    var input = e('.input')
    input.addEventListener('change', function (event) {
        var value = input.value
        var time = Number(value) / 100 * player.duration
        player.currentTime = time
        progressChangeStyle()
    })
}
// 进度条变化
var progressChange = function () {
    var input = e('.input')
    var player = e('.player')
    player.addEventListener('timeupdate', function () {
        progressChangeStyle()
    })
}

// 音量条
var musicVol = function () {
    var player = e('.player')
    var vol = e('.vol')
    var volIcon = e('.volIcon')
    // 音量条默认样式
    var percent = vol.value * 100 + '%'
    vol.style.backgroundSize = percent + '100%'
    // log('原来的百分比', percent)
    vol.addEventListener('change', function (event) {
        // 样式变化
        var percent = vol.value * 100 + '%'
        vol.style.backgroundSize = percent + '100%'
        // log('后来的百分比', percent)
        // 音乐音量变化
        player.volume = vol.value
    })
    // 静音
    volIcon.addEventListener('click', function (event) {
        vol.value = 0
        vol.style.backgroundSize = '0%' + '100%'
        player.volume = 0
    })
}

// 列表数据增加
var musicList = function () {
    var songName = ''
    var songSinger = ''
    var songDuration = ''
    var songNameBox = e('.songNameBox')
    var singerBox = e('.singerBox')
    var totalTimeBox = e('.totalTimeBox')
    for (var i = 0; i < songList.length; i++){
        var music = songList[i]
        var songId = i
        songName += templateName(music, songId)
        songSinger += templateSinger(music, songId)
        songDuration += templateDuration(music, songId)
        songNameBox.innerHTML = songName
        singerBox.innerHTML = songSinger
        totalTimeBox.innerHTML = songDuration
    }
}

var templateName = function (music, songId) {
    var name = music.name
    var num = songList.length
    var songName = `
        <div class="songName" data-id="${songId}">
                <span class="font" data-id="${songId}">${name}</span>
        </div>
    `
    return songName
}
var templateSinger = function (music, songId) {
    var singer = music.singer
    var songSinger = `
        <div class="singer" data-id="${songId}">
            <span class="font" data-id="${songId}">${singer}</span>
         </div>
    `
    return songSinger
}
var templateDuration = function (music, songId) {
    var duration = music.duration
    var songDuration = `
        <div class="totalTime" data-id="${songId}">
            <span class="font" data-id="${songId}">${duration}</span>
        </div>
    `
    return songDuration
}

// 播放列表的正在播放 CSS
// 列表移动移出CSS 通用函数
var musicListCSSCommon = function (props, props1, props2, incident, color) {
    for (var i = 0; i < props.length; i++){
        var prop = props[i]
        prop.addEventListener(incident, function(event){
            var id = event.target.dataset.id
            var prop1 = props1[id]
            var prop2 = props2[id]
            prop1.style.backgroundColor = color
            prop2.style.backgroundColor = color
            // 如果移动到字上面
            if (event.target.classList.contains('font')){
                event.target.parentElement.style.backgroundColor = color
            }else {
                event.target.style.backgroundColor = color
            }
        })
    }
}
var musicListCSS = function () {
    var songNames = es('.songName')
    var singers = es('.singer')
    var totalTimeAll = es('.totalTime')
    // 鼠标放歌名上
    musicListCSSCommon(songNames, singers, totalTimeAll, 'mouseover', '#2b2b2b')
    musicListCSSCommon(songNames, singers, totalTimeAll, 'mouseout', 'grey')
    // 鼠标放歌手上
    musicListCSSCommon(singers, songNames, totalTimeAll, 'mouseover', '#2b2b2b')
    musicListCSSCommon(singers, songNames, totalTimeAll, 'mouseout', 'grey')
    // 鼠标放事件上
    musicListCSSCommon(totalTimeAll, songNames, singers, 'mouseover', '#2b2b2b')
    musicListCSSCommon(totalTimeAll, songNames, singers, 'mouseout', 'grey')
}

// 指针移动 CD移动 播放按钮等一一系列样式
// 播放状态
var playStatus = function () {
    var needle = e('.needle')
    // 指针移上
    needle.style.transform = 'rotateZ(-17deg)'
    // CD转动
    rotateCD()
}
// 停止状态
var stopStatus = function () {
    var needle = e('.needle')
    // 指针移开
    needle.style.transform = 'rotateZ(-38deg)'
    // CD停止
    stopCD()
}
// 播放按钮的改变
// 播放状态
var playStyle = function () {
    var playButton = e('.playIcon')
    // 点了播放
    playButton.src = '/img/pause.png'
    playButton.classList.remove('pause')
    playStatus()
}
// 暂停状态
var pauseStyle = function() {
    var playButton = e('.playIcon')
    // 点了暂停
    playButton.src = '/img/play.png'
    playButton.classList.add('pause')
    stopStatus()
}

// 播放/暂停音乐功能
var musicPlay = function () {
    var playButton = e('.playIcon')
    var player = e('.player')
    var needle = e('.needle')
    // 点击播放图标变换和指针移动
    playButton.addEventListener('click', function (event) {
        // log(event.target)
        if (event.target.classList.contains('pause')){
            // log('点了播放')
            // 点了播放
            updateTime()
            playStyle()
            play()
        }else{
            // log('点了暂停')
            // 点了暂停
            updateTime()
            pauseStyle()
            pause()
        }
    })
}

// 下一首
var next = function () {
    var player = e('.player')
    var str = parseInt(player.dataset.id)
    var index = (str + songList.length + 1) % songList.length
    updateInfo(songList[index], index)
    updateTime()
    pause()
    setTimeout(play, 500)
}
var musicNext = function () {
    var player = e('.player')
    var nextButton = e('.nextIcon')
    var way = e('.way')
    nextButton.addEventListener('click', function (event) {
        var str = parseInt(way.dataset.id)
        // 考虑播放模式情况
        if (str == 0){
            log('点击下一首 此时为列表循环')
            listLoop()
        }
        if (str == 1){
            log('点击下一首 此时为单曲循环')
            repeat()
        }
        if (str == 2){
            log('点击下一首 此时为随机播放')
            random()
        }
        // 改变播放按钮以及指针CD的状态
        playStyle()
    })
}
// 上一首
var pre = function () {
    var player = e('.player')
    var str = parseInt(player.dataset.id)
    log('str是什么', str)
    var index = (str + songList.length - 1) % songList.length
    log('index是什么', index)
    player.dataset.id = index
    updateInfo(songList[index], index)
    updateTime()
    pause()
    setTimeout(play, 500)
}
var musicPre = function () {
    var player = e('.player')
    var preButton = e('.preIcon')
    var way = e('.way')
    preButton.addEventListener('click', function (event) {
        var str = parseInt(way.dataset.id)
        // 考虑播放模式情况
        if (str == 0){
            log('点击上一首 此时为列表循环')
            pre()
        }
        if (str == 1){
            log('点击上一首 此时为单曲循环')
            repeat()
        }
        if (str == 2){
            log('点击上一首 此时为随机播放')
            random()
        }
        // 改变播放按钮以及指针CD的状态
        playStyle()
    })
}

// 播放时候CD转动
var rotateCD = function () {
    var cd = e('.cdBoxImg')
    initCustomProps(cd, 'interval')
    if (cd.dregree === undefined) {
        cd.dregree = 0
    }
    // 先初始化
    clearInterval(cd.interval)
    cd.interval = setInterval(function(){
        cd.dregree = (cd.dregree + 0.25) % 360
        var style = `rotateZ(${cd.dregree}deg)`
        cd.style.transform = style
    }, 20)
}
// 暂停歌曲CD停止转动
var stopCD = function () {
    var cd = e('.cdBoxImg')
    clearInterval(cd.interval)
}

// 更新播放信息
var updateInfo = function (song, index) {
    var player = e('.player')
    var musicTit = e('.musicTit')
    var musicSinger = e('.musicSinger')
    var musicAlbum = e('.musicAlbum')
    var albumImg = e('.albumImg')
    var musicBackground = e('.musicBackground')
    var playing = e('.playing')
    
    var currentSong = song.name
    var currentSinger = song.singer
    var currentAlbum = song.album
    var currentAlbumImg = song.imgPath
    
    var basePath = 'music/'
    var path = basePath + song.music
    player.src = path
    
    playing.innerHTML = `正在播放：${currentSong} - ${currentSinger}`
    
    musicTit.innerHTML = `${currentSong}`
    musicSinger.innerHTML = `${currentSinger}`
    musicAlbum.innerHTML = `专辑：${currentAlbum}`
    
    albumImg.src = '/img/' + currentAlbumImg
    musicBackground.style.backgroundImage = 'url(/img/' + currentAlbumImg + ')'
    
    player.dataset.id = index
    log('目前播放的信息', player)
    specialTitChange()
}

// 显示多位数辅助函数
function fix(num, length) {
    return ('' + num).length < length ? ((new Array(length + 1)).join('0') + num).slice(-length) : '' + num;
}
// 进度条播放时间的更新
var updateTime = function () {
    var player = e('.player')
    var timePercent = e('.timePercent')
    player.addEventListener('timeupdate', function (event) {
        var currentDuration = player.duration
        var currentTime = player.currentTime
        // 总时间
        var minute = fix(Math.floor(currentDuration / 60), 2)
        var second = fix(parseInt((currentDuration / 60 - minute) * 60), 2)
        // 现在的时间
        if (currentTime < 60){
            var minuteNow = fix(0, 2)
            var secondNow = fix(parseInt(currentTime), 2)
        }else{
            var minuteNow = fix(Math.floor(currentTime / 60) ,2)
            var secondNow = fix(parseInt((currentTime / 60 - minuteNow) * 60), 2)
        }
        timePercent.innerHTML = `${minuteNow}:${secondNow}/${minute}:${second}`
    })
}

// 几首歌的css修改
var specialTitChange = function () {
    var musicTit = e('.musicTit')
    var musicSinger = e('.musicSinger')
    var musicAlbum = e('.musicAlbum')
    if (musicTit.innerText == "NoMoney" || musicTit.innerText == "大艺术家" ||
        musicTit.innerText == "HadMyDoubts" || musicTit.innerText == "TheCure"){
        musicTit.classList.add('white')
        musicSinger.classList.add('white')
        musicAlbum.classList.add('white')
    }else{
        musicTit.classList.remove('white')
        musicSinger.classList.remove('white')
        musicAlbum.classList.remove('white')
    }
}

// 播放方式改变
// 播放方式图标改变
var musicWayChangeStyle = function () {
    var way = e('.way')
    way.addEventListener('click',function (event) {
        var str = parseInt(event.target.dataset.id)
        var index = (str + wayList.length + 1) % wayList.length
        event.target.dataset.id = index
        var path = '/img/' + wayList[index].imgPath
        event.target.src = path
        log('点击之后的下标是什么', index, way)
    })
}

// 自动播放模式下
// 列表循环
var listLoop = function () {
    // log('执行了列表循环')
    var player = e('.player')
    next()
}
// 单曲循环
var repeat = function () {
    // log('执行了单曲循环')
    var player = e('.player')
    var index = parseInt(player.dataset.id)
    updateInfo(songList[index], index)
    setTimeout(play, 500)
}
// 随机播放
var random = function () {
    // log('执行了随机播放')
    var player = e('.player')
    // 原来的下标
    var index = parseInt(player.dataset.id)
    // 随机后的下标
    var randomIndex = randomBetween(0, 10)
    // 如果两个下标一样就继续随机
    if (index == randomIndex){
        randomIndex = randomBetween(0, 10)
    }
    updateInfo(songList[randomIndex], randomIndex)
    setTimeout(play, 500)
}

// 随机函数
var randomBetween = function(start, end) {
    var n = Math.random() * (end - start + 1)
    return Math.floor(n + start)
}

// 自动播放
var autoNext = function () {
    var player = e('.player')
    var way = e('.way')
    player.addEventListener('ended', function (event) {
        var str = parseInt(way.dataset.id)
        log('播放结束')
        if (str == 0){
            log('列表循环')
            listLoop()
        }
        if (str == 1){
            log('单曲循环')
            repeat()
        }
        if (str == 2){
            log('随机播放')
            random()
        }
    })
}

// 点歌
var selectSong = function () {
    var songsCon = e('.songsCon')
    songsCon.addEventListener('click', function (event) {
        var id = event.target.dataset.id
        log('点击部分和id', event.target, event.target.dataset.id)
        var song = songList[id]
        updateInfo(song, id)
        playStyle()
        updateTime()
        pause()
        setTimeout(play(), 500)
    })
}

// 3.相册
var album = function () {
    var mainBody = e('.mainBody')
    var album = `
        <div class="album"></div>
    `
    mainBody.innerHTML = album
}



var clickSwitch = function () {
    var navs = es('.nav')
    for (var j = 0; j < navs.length; j++){
        var nav = navs[j]
        nav.addEventListener('click',function (event) {
            var target = event.target
            // log(target, target.innerText)
            if (target.innerText == "首页"){
                homePage()
            }
            if (target.innerText == "关于我"){
                aboutMe()
            }
            if (target.innerText == "相册"){
                album()
            }
            if (target.innerText == "音乐"){
                music()
            }
        })
    }
    // log('执行clickSwitch点击切换模块函数')
}









var _main = function () {
    // log('执行main总函数')
    blogAll()
    searchBlog()
    navigationBlog()
    lunpoClick()
    clickSwitch()
}

_main()
