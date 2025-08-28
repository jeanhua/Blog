---
title: C语言中文乱码解决方案-vscode
date: 2024-12-09 21:46:48
tags:
- C++
categories:
- 方法论
typora-root-url: ./..
---

最近写数据结构作业发现vscode写C++编译后输出中文会乱码，之前用visual studio没有这种情况，研究了一下发现是源代码文件编码问题，默认是utf-8编码，改为gb2312保存再编译就好了

![](/image/C++中文乱码解决方案-vscode/1.png)

![](/image/C++中文乱码解决方案-vscode/2.png)

![](/image/C++中文乱码解决方案-vscode/3.png)

![](/image/C++中文乱码解决方案-vscode/4.png)

![](/image/C++中文乱码解决方案-vscode/5.png)
