---
title: ubuntu服务器配置网站(apache2)
date: 2024-07-20 22:05:25
tags:
- 服务器
- 网站
categories:
- 方法论
typora-root-url: ./..
---

<meta name="referrer" content="never">


**如果使用nginx服务器可查看：**

{% link ubuntu服务器配置网站(nginx)::/2025/04/11/5fb9cba11d0f/  %}

# 一、安装apache2
```bash
sudo apt-get update
sudo apt-get install apache2
```
然后在地址栏输入公网IP看是否能访问到如下页面

![Snipaste_2025-11-08_20-46-29](/image/ubuntu配置服务器/Snipaste_2025-11-08_20-46-29.png)

此时网站的页面在/var/www/html/目录下，修改即可

# 二、配置多网站
如果想要一个服务器配置多个网站比如 jeanhua.cn 和 blog.jeanhua.cn(通过主机头来区分)

在Apache的配置目录中（通常是/etc/apache2/sites-available），为每个网站创建一个新的配置文件。
## 对于blog.jeanhua.cn：
```bash
sudo nano /etc/apache2/sites-available/blog.jeanhua.cn.conf
```
添加以下内容：
```
<VirtualHost *:80>
	# 这里是你的邮箱
    ServerAdmin email@email.com
    # 域名
    ServerName blog.jeanhua.cn
    # 别名
    ServerAlias www.blog.jeanhua.cn
    # 网页根目录
    DocumentRoot /var/www/blog

    <Directory /var/www/blog>
    	# 这里建议把 Indexes 去掉，避免网页目录结构暴露
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```
## 对于jeanhua.cn：
```bash
sudo nano /etc/apache2/sites-available/jeanhua.cn.conf
```
添加以下内容：
```
<VirtualHost *:80>
	# 这里填邮箱
    ServerAdmin email@email.com
    # 域名
    ServerName jeanhua.cn
    # 别名
    ServerAlias www.jeanhua.cn
    # 网页根目录
    DocumentRoot /var/www/html

    <Directory /var/www/html>
    	# 这里建议把下面的 Indexes 去掉，避免网页目录结构暴露
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```
接下来启用配置
```bash
sudo a2ensite blog.jeanhua.cn.conf
sudo a2ensite jeanhua.cn.conf
```
**注意：如果你的服务器上已经有一个默认的虚拟主机配置（通常名为000-default.conf），并且你不想使用它，你可以通过运行下面的命令来禁用它**
```bash
sudo a2dissite 000-default.conf
```

最后，重载Apache配置以应用更改：
```bash
sudo systemctl reload apache2
```

# 三、配置https
正常情况下到上面已经结束了，但是我们访问时浏览器经常提示页面不安全，于是我们要配置https，同时提升网站安全性。
## 1.安装 Certbot
Certbot 是一个自动化的证书颁发和管理工具，可以用来获取 Let’s Encrypt 的证书。
```bash
sudo apt-get update
sudo apt-get install certbot python3-certbot-apache
```
## 2.获取 SSL 证书
使用 Certbot 获取 SSL 证书，同时自动修改 Apache 配置文件以启用 HTTPS。

对于 blog.jeanhua.cn：
```bash
sudo certbot --apache -d blog.jeanhua.cn -d www.blog.jeanhua.cn
```
对于 jeanhua.cn：
```bash
sudo certbot --apache -d jeanhua.cn -d www.jeanhua.cn
```
**在过程中，Certbot 可能会询问你一些问题，比如你的电子邮件地址和是否需要自动重定向 HTTP 流量到 HTTPS，请输入你的邮箱并稍后前往邮箱点击链接验证**
## 3.检查 Apache 配置
Certbot 应该已经自动修改了 Apache 的配置文件，为每个域名添加了 HTTPS 虚拟主机配置。你可以通过以下命令来检查配置文件：
```bash
sudo nano /etc/apache2/sites-available/blog.jeanhua.cn-le-ssl.conf
sudo nano /etc/apache2/sites-available/jeanhua.cn-le-ssl.conf
```
## 4.启用 SSL 虚拟主机
如果 Certbot 没有自动启用新的 SSL 虚拟主机配置文件，你可以手动启用它们：
```bash
sudo a2ensite blog.jeanhua.cn-le-ssl.conf
sudo a2ensite jeanhua.cn-le-ssl.conf
```
## 5.重启 Apache
```bash
sudo systemctl restart apache2
```
**大功告成，现在访问你的页面应该可以看到是https安全的了**

# 四、配置端口转发(可选)

如果要配置子域名转发到本地某端口，则进行如下操作

## 1.编辑配置文件

如上一样，写一个.conf文件，输入下面的内容

```
<VirtualHost *:80>
    ServerAdmin email@email.com
    ServerName test.jeanhua.cn
    ServerAlias www.test.jeanhua.cn

    # 将所有请求转发到本地 1234 端口
    ProxyPass / http://localhost:1234/
    ProxyPassReverse / http://localhost:1234/
    # 或者转发部分,进行前后端协同
    # ProxyPass /api http://localhost:1234
    # ProxyPassReverse /api http://localhost:1234

    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```

## 2.启动代理模块

```
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo systemctl restart apache2
```

如果要配置https可按照上面相同操作
