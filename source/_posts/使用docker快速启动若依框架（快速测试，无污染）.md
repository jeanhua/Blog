---
title: 使用docker快速启动若依框架（快速测试，无污染）
date: 2025-05-05 14:29:17
tags:
- java
- 若依框架
- docker
categories:
- 方法论
---

> RuoYi 是一个 Java EE 企业级快速开发平台，基于经典技术组合（Spring Boot、Apache Shiro、MyBatis、Thymeleaf、Bootstrap），内置模块如：部门管理、角色用户、菜单及按钮授权、数据权限、系统参数、日志管理、通知公告等。在线定时任务配置；支持集群，支持多数据源，支持分布式事务。

但是部署若依框架要安装的前置工具有MySQL、Redis数据库，在windows下mysql安装比较繁琐，卸载更是一堆问题，我们只是想要学习测试一下若依框架的使用，那怎么简单快速搭建起来呢？

**注：本篇需要科学上网条件**

## 一、安装docker

### 1.下载安装

点击下方链接前往docker官网下载安装docker桌面版

https://www.docker.com/products/docker-desktop/

安装完成是这个界面

![docker](/image/使用docker快速启动若依框架/docker.png)

### 2.镜像下载

接下来点击搜索Mysql，点击Pull，将镜像下载下来

> mysql镜像大概1个G，网络条件差的可能要等一会

![docker](/image/使用docker快速启动若依框架/search_mysql.png)

同理，把Redis也Pull下来

![docker](/image/使用docker快速启动若依框架/search_redis.png)

下载完成后点击左侧Image，界面如图

![docker](/image/使用docker快速启动若依框架/image.png)

### 3.启动容器

点击mysql的三角形按钮，启动容器，界面如下，输入对应参数

![docker](/image/使用docker快速启动若依框架/boot1.png)

完成后点击**Run**

如下即可

![docker](/image/使用docker快速启动若依框架/container1.png)

同理，把Redis也创建一个容器

![docker](/image/使用docker快速启动若依框架/image2.png)

直接点击**Run**

![docker](/image/使用docker快速启动若依框架/boot2.png)

出现下面的界面即可大功告成

![docker](/image/使用docker快速启动若依框架/ready.png)

## 二、下载若依框架

### 1.使用Git克隆仓库

```bash
git clone https://gitee.com/y_project/RuoYi-Vue.git
```

或者直接去这里下载

https://gitee.com/y_project/RuoYi-Vue.git

点击`克隆/下载`->`下载zip`

完成解压后会出现一个`RuoYi-Vue`文件夹即可完成

## 三、创建数据表

### 1.使用`Navicat`软件连接本地数据库

![navicat](/image/使用docker快速启动若依框架/navicat_connect.png)

### 2.创建数据库

![navicat](/image/使用docker快速启动若依框架/createdatabase.png)

### 3.导入数据表

对应的sql文件在刚才下载的若依框架的`RuoYi-Vue/sql`文件夹下

![navicat](/image/使用docker快速启动若依框架/createTable.png)

导入这两个sql即可

![navicat](/image/使用docker快速启动若依框架/sql.png)

## 四、配置若依框架

### 1.配置Mysql连接

![config](/image/使用docker快速启动若依框架/config1.png)

### 2.配置Redis

![config](/image/使用docker快速启动若依框架/config2.png)

## 五、运行若依框架

把若依目录下`ruoyi-admin\src\main\java\com\ruoyi\RuoYiApplication.java`运行起来

![end](/image/使用docker快速启动若依框架/endbackend.png)

出现下面的即可成功

![end](/image/使用docker快速启动若依框架/success.png)

> 如果报错一堆的话，可以在docker那里把`Redis`的`container`停止然后删除，在`image`那里重新生成`Redis`，生成的时候**不要直接Run**了，配置换一个端口(参考mysql)，然后去`ruoyi-admin\src\main\resources\application.yml`修改为对应的端口即可

## 六、运行若依前端

打开`RuoYi-Vue\ruoyi-ui`目录，在当前目录下运行`npm install`

然后运行`npm run dev`

出现下面的界面即可大功告成

![success](/image/使用docker快速启动若依框架/front_success.png)
