---
title: 平板串流window桌面记录
date: 2025-10-16 13:54:24
tags:
- 串流
- ddns
- sunshine
- moonlight
categories:
- 随笔
typora-root-url: ./..
---

## 背景

由于我电脑是游戏本，离电基本没啥续航，而且电脑和电源适配器都重的要死，背去上课跟个几个大板砖似的，于是想到，使用平板串流电脑的办法，这样就只需要带个平板和小键盘小鼠标就行，由此展开下面研究

## 前言

之前串流一直使用的vivo办公套件的远控助手(平板自带)，有如下缺点

- 延迟高
- 有莫名其妙的bug，远控一段时间分辨率会突变导致出现黑框
- 由于校园网问题，串流一段时间后会断开，此时需要电脑端部署一个脚本来自动判断重新登陆校园网，但是断开还是导致体验感很差

本来刚开始是使用sunshine+moonlight串流方案的，但是有如下缺点：

- 电脑分辨率和平板不一样，导致串流到平板后出现黑框
- 校园网问题同上

> 这学期刚好我选了一堆选修水课，之前一段时间都是在无聊打发时间

## 转机

感谢 [57u](https://blog.57u.tech) 大佬大力支持的路由器，我又提起兴趣好好研究一下了，经过多方考虑，最终得出如下解决方案

![路由器](/image/平板串流window桌面记录/路由器.jpg)

## 需要材料

设备：Xiaomi路由器BE3600 2.5G版、VIVO 平板、华硕薄膜键盘、英菲克无线鼠标

网络：电信校园宽带（买电信校园卡送的）、域名

串流软件：**Sunshine + Moonlight 魔改版**

https://github.com/qiin2333/Sunshine-Foundation

https://github.com/qiin2333/moonlight-vplus

## 如何做

### 1.配置sunshine和moonlight

从上面链接下载对应的sunshine版本安装在window上面，moonlight安装到平板上面，内网配对测试可以正常串流后

在sunshine配置设置那里添加平板的分辨率和帧率，我的平板是2800x1840

![sunshine_config](/image/平板串流window桌面记录/sunshine_config.png)

添加完成后点击保存应用

然后在平板上moonlight设置里面设置：主机设置→自动优化主机设置：打开

![moonlight_config](/image/平板串流window桌面记录/moonlight_config.jpg)

现在串流应该可以看到内容已经铺满屏幕，没有黑框了

### 2.配置网络条件

上面说到，之前是使用DHCP模式获取IP上网，校园网最近有问题，过段时间会自动断开需要重新登陆，现在配合路由器，进行如下操作

#### 在路由器管理页面，使用拨号上网

![route](/image/平板串流window桌面记录/route.png)

现在就拥有了一个动态的公网IP

#### 接着需要配置一下ddns

https://github.com/jeessy2/ddns-go

安装完成后在 http://localhost:9876/ 进行配置（需要自己准备一个域名）

![ddns_go](/image/平板串流window桌面记录/ddns_go.png)

配置完成后你的域名就可以动态解析到你的路由器上了

#### 接着使用端口转发，把串流使用的对应端口转发到公网

还是在路由器管理页面上 192.168.31.1

![端口转发](/image/平板串流window桌面记录/端口转发.png)

**记得目标IP是你的电脑的局域网IP地址，可以在任务管理器→性能→以太网 那里看**

#### 使用静态IP绑定

这一步是防止你重启电脑或路由器后导致电脑在局域网的IP变化导致端口转发失效

![静态DHCP](/image/平板串流window桌面记录/静态DHCP.png)

最后在moonlight里面配对一下，**记得这里配对要用你的DDNS域名，不要用IP**

现在就大功告成了

## 最终收获

1. 自适应分辨率远程高清低延迟串流
2. 寝室无限设备联网
3. 公网（甚至可以买个小主机放寝室当服务器用）

![result](/image/平板串流window桌面记录/result.jpg)
