---
title: 关于Visual Studio报错scanf_s等*_s代码报错的解决方案
tags: 
- visual studio
excerpt: ''
date: 2024-06-17 16:41:00
---

<meta name="referrer" content="never">

### 问题：用visual studio写代码时经常碰到scanf报错,strcpy报错等情况
![image](https://img2024.cnblogs.com/blog/3318028/202406/3318028-20240617163357785-1209252014.png)
##### 但是又不想改代码怎么办呢？

<!-- more -->

### 解决办法
- 点击"项目"
- 点击"属性"
- "C/C++"
- "常规"
- "SDL检查"设置为否

![image](https://img2024.cnblogs.com/blog/3318028/202406/3318028-20240617163840839-1093956913.png)


![image](https://img2024.cnblogs.com/blog/3318028/202406/3318028-20240617163953967-131755156.png)

##### 然后确定即可正常编译