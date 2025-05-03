---
title: 解决安装cuda时vs报错MSB3721的问题
tags: 
- cuda
- visual studio
categories:
- 方法论
date: 2024-06-03 09:03:00
---

<meta name="referrer" content="never">

以下几种可能
- 1.调整调试平台为x64
![](https://images.cnblogs.com/cnblogs_com/blogs/807529/galleries/2403669/o_240612011843_%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202024-06-03%20085054.png)
- 2.点击vs顶部导航栏的调试->最下面那一项属性->CUDA C/C++ ->Common->CUDA Dustuom Dir设置为你安装CUDA toolkit的目录
- 3.如果你的电脑系统用户名为中文，请前往环境变量->用户变量，将tmp和temp的值修改为一个新文件夹(建议在D盘里面创建一个temp文件夹，然后把C盘用户里面的temp文件夹里面的内容剪切到D:\temp里面然后修改用户变量的值)
![](https://images.cnblogs.com/cnblogs_com/blogs/807529/galleries/2403669/o_240612011641_%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202024-06-03%20090027.png)