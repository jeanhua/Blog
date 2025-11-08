---
title: 解决安装cuda时vs报错MSB3721的问题
tags: 
- cuda
- visual studio
categories:
- 方法论
date: 2024-06-03 09:03:00
typora-root-url: ./..
---

<meta name="referrer" content="never">

以下几种可能
- 1.调整调试平台为x64
  ![](/image/解决vs安装cuda的MSB3721错误/o_240612011843_屏幕截图%202024-06-03%20085054.png)
- 2.点击vs顶部导航栏的调试->最下面那一项属性->CUDA C/C++ ->Common->CUDA Dustuom Dir设置为你安装CUDA toolkit的目录
- 3.如果你的电脑系统用户名为中文，请前往环境变量->用户变量，将tmp和temp的值修改为一个新文件夹(建议在D盘里面创建一个temp文件夹，然后把C盘用户里面的temp文件夹里面的内容剪切到D:\temp里面然后修改用户变量的值)
  ![](/image/解决vs安装cuda的MSB3721错误/o_240612011641_屏幕截图%202024-06-03%20090027.png)