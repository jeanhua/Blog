---
title: go开发简单的http框架
date: 2025-05-02 23:25:23
tags:
- golang
categories:
- 随笔
---

## 前言

最近在学习Go语言的http开发，打算写一个简单的Http api框架，总结一下

## 框架设计

简单设计了几个api

get和post

```go
engine.MapGet("/hello", helloHandler)
engine.MapPost("/echo", echoHandler)

// handle函数原型
func(request *http.Request, body []byte, params url.Values) (status int, response interface{})
```

中间件

```go
engine.Use(func(ctx *engine.Contex) {
    fmt.Println("Before handler")
    ctx.Next()
    fmt.Println("After handler")
})
```

静态文件

```go
engine.UseStaticFiles("./public") // 设置静态资源根目录
```

---

其实go自带的http服务就很不错了，基本上是主流编程语言中非框架的最简单的实现了，本框架主要是做了一些简单的封装，加上静态文件和中间件支持，然后把返回结构设计成了函数返回，自动进行json序列化

具体查看[jeanhua/jokerhttp: go开发的简单http框架](https://github.com/jeanhua/jokerhttp)

## 遇到的小坑

### 中间件问题

原本的实现是

```go
ctx := &Contex{
            Request:          r,
            ResponseWriter:   w,
            MiddlewareChains: jokerEngine.middlewares,
            index:            -1,
            maxIndex:         middlewareCount + 1,
        }
```

这里的中间件是引用全局的中间件，但是没注意到路由污染，虽然测试时没发现什么问题，但是我突然灵机一动（可能就是xw老师说的语感🤔），发现了这个问题，如果一个路由没有写回，就会传导到下一个路由，但是由于封装的返回值，每个路由都是会写回的，误打误撞不会触发这个问题，但是严谨起见，还是改了下面这种

```go
ctx := &Contex{
			Request:          r,
			ResponseWriter:   w,
			MiddlewareChains: make([]Middleware, middlewareCount+1),
			index:            -1,
			maxIndex:         middlewareCount + 1,
		}
		copy(ctx.MiddlewareChains, jokerEngine.middlewares)
```

### 相对路径问题

测试静态文件服务时

```go
// 静态文件服务
joker.UseStaticFiles("./static")
```

访问静态文件时自动重定向到了`/`，我明明没写这个重定向逻辑，后面发现了是运行路径的问题，这是子文件夹下的代码和静态文件，我的vscode的terminal的目录是在项目根目录下，导致相对路径出现问题，找不到文件时go内置的静态文件服务器返回到了根目录🤣，只需要`cd`到当前目录下再`go run main.go`就行了
