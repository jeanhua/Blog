---
title: python爬虫入门
tags: 
- python
- 爬虫
categories:
- 爬虫
date: 2024-06-15 14:36:00
---

<meta name="referrer" content="never">

###### 注：本篇需要python基础，html基础
<!-- more -->

一、准备工作
在开始编写Python爬虫之前，我们需要做一些准备工作。首先，确保你的电脑上已经安装了Python环境。然后，我们需要安装一些Python库，这些库可以帮助我们更方便地编写爬虫。其中最重要的库是requests。requests库用于发送HTTP请求。安装这个库非常简单，只需要在命令行中输入以下命令即可：

```
pip install requests
```
二、简单爬虫示例
假设我们要爬取一个名为 "http://www.quanshu.wang/" 的网站内容
```python
import requests
# 发送HTTP请求获取网页内容
url = 'http://www.quanshu.wang/'
response = requests.get(url)
# 打印网页内容
print(response.text)
```
运行这段代码，结果如下
```html
<!DOCTYPE html>
<html>
	<head>
	    <meta charset="utf-8">
	    <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width">
	    <meta name="keywords" content="全书网, 在线阅读, 最新小说,女生小说">
	    <meta name="description" content="全书网是一个免费在线阅读最新小说的网站，提供各种类型的小说供读者选择，快来全书网畅游阅读的世界吧！">
	    <title>全书网-在线全本免费小说</title>
             <meta http-equiv="content-language" content="zh-CN"/>
	    <link rel="stylesheet" href="/template/home/default_web/css/style.css" type="text/css"/>
    </head>
	
……（省略下面的内容）
```
即可得到该网站的源码，但是我们发现这并没有什么使用价值，因为这只是未解析的网站源代码

##### 在下篇文章中，我们将探讨如何利用爬虫获取实用的数据