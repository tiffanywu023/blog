// 引入 express 并且创建一个 express 实例赋值给 app
var express = require('express')
var app = express()
var bodyParser = require('body-parser')

app.use(bodyParser.json())

// 配置静态文件目录
app.use(express.static('static'))


const registerRoutes = function(app, routes) {
    for (var i = 0; i < routes.length; i++) {
        var route = routes[i]
        app[route.method](route.path, route.func)
    }
}

const routeModules = [
    './route/index',
    './route/blog',
]

// 这边是一个综合写法 假设所有的路由都放在一起 如routeModules
var registerAll = function(routeFiles){
    for (var i = 0 ; i < routeFiles.length; i++){
        var file = routeFiles[i]
        var r = require(file)
        registerRoutes(app, r.routes)
    }
}

registerAll(routeModules)

var server = app.listen(8084, function () {
  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)
})
