---
title: 吐槽flutter
date: 2024-09-20 23:13:58
tags:
- flutter
- 吐槽
categories:
- 随笔
---

准备拿flutter框架开发大创的前端项目，趁着其他部分没准备好，随便做一个app练练手，本来想继续改我那个safe-chat项目的，但是写的太烂了，导致我现在看不懂了🤣，而且那玩意只做了个发文字的功能，丑的一批，于是从头再来，然后加一下气泡和颜色，加发图片的功能，美化一下ui

写TextField的时候本来想设置限制行数的，结果遇到一个抽象玩意儿

<!-- more -->

这么看没问题

```dart
Container(
            decoration: const BoxDecoration(color: Colors.yellow),
            child: const TextField(
              style: TextStyle(color: Colors.black, fontSize: 25),
              maxLines: 14,
            ),
          )
```

**但是**

![image](image/吐槽flutter/1.png)

问题居然出在这里

```dart
Container(
  decoration: const BoxDecoration(color: Colors.yellow),
  child: const TextField(
    style: TextStyle(color: Colors.black, fontSize: 25),
    maxLines: null, //设置为null就正常了
  ),
)
```

![image](image/吐槽flutter/2.png)

最大行数拿去当占位符了是吧。。。。

还是得靠代码整活

![image](image/吐槽flutter/3.png)

