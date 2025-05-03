---
title: 花了4个小时，实现了博客自动构建脚本(golang)
date: 2025-05-04 00:21:06
tags:
- golang
- github
- hmac256
- 博客
- 自动化
categories:
- 随笔
---

## 前言

最近服务器快到期了，准备换新服务器，随即打算整理一下资料准备转移，到博客这里发现，之前是构建后push到github，再通知后端进行git pull，但是发现每次push的成品更改很多，导致.git文件很大，按理说git仓库只应该存储源码，于是准备换成后端pull源码进行构建，但是遇到如下问题：

## nginx软链接404问题

nginx的页面根目录是限制在`/var/www/`下的，但是我的代码文件不应该放这里，于是打算创建一个软链接，指向`/home/jeanhua/Blog/public`，刚好构建完就可以，不用复制文件过去，但是出现了404的问题，排查了一下发现是权限问题，nginx的组是www-data，解决办法也很简单，直接给博客目录和对应的父目录使用`chmod +x 文件夹`即可

## github webhook secret问题

按照官方文档进行的鉴权代码，我自己实现了go版本，但是发现校验失败，检查很多都没发现问题，更离谱的是使用github页面日志的原样数据进行加密后也得不到相应的结果，最后折腾3个小时发现是GitHub请求的json是最小化处理过的，也就是说把多余的空格都去掉了，但是抽象的是**页面日志显示的json是格式化的**（如图），我直接复制加密的结果是错的😡

![image](/image/webhook/1.png)

## vim 自动在结尾加换行符问题

上面的问题解决后，在本地进行测试，加密结果是一致的，但是部署在服务器上面的就是出问题了，找了一堆地方，没发现问题，最后灵机一动，把密钥打印出来，发现多了一个换行符，但是用vim打开的时候没发现结尾有换行符的，我写的时候也每加换行符，一查资料，发现是vim自己加的😏，于是去掉之后成功了

[vim移除自动添加的换行符_取消vi编辑器自动换行-CSDN博客](https://blog.csdn.net/Quincuntial/article/details/111374789)

## 最后成果

[jeanhua/github-webhook-go: go实现github webhook](https://github.com/jeanhua/github-webhook-go)
