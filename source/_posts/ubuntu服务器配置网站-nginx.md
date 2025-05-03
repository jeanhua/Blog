---
title: ubuntu服务器配置网站(nginx)
date: 2025-04-11 23:15:25
tags:
- 服务器
- 网站
categories:
- 方法论
---

## 一、安装 Nginx

首先，更新 Ubuntu 的包索引，并安装 Nginx。

```bash
sudo apt-get update
sudo apt-get install nginx
```

安装完成后，你可以通过在浏览器中访问服务器的公网 IP 地址来验证 Nginx 是否已成功安装并运行。默认情况下，Nginx 会在 `/var/www/html/` 目录下提供一个欢迎页面。

## 二、配置多网站

### 1. 创建网站配置文件

在 Nginx 的配置目录中（通常是 `/etc/nginx/sites-available/`），为每个网站创建一个新的配置文件。例如，为 `jeanhua.cn` 和 `blog.jeanhua.cn` 创建配置文件。

#### 对于 `blog.jeanhua.cn`：

```
sudo nano /etc/nginx/sites-available/blog.jeanhua.cn
```

添加以下内容：

```nginx
server {
    listen 80;
    server_name blog.jeanhua.cn www.blog.jeanhua.cn;

    root /var/www/blog;
    index index.html index.htm index.nginx-debian.html;

    location / {
        try_files $uri $uri/ =404;
    }

    error_log /var/log/nginx/blog.jeanhua.cn-error.log;
    access_log /var/log/nginx/blog.jeanhua.cn-access.log;
}
```

#### 对于 `jeanhua.cn`：

```bash
sudo nano /etc/nginx/sites-available/jeanhua.cn
```

添加以下内容：

```nginx
server {
    listen 80;
    server_name jeanhua.cn www.jeanhua.cn;

    root /var/www/html;
    index index.html index.htm index.nginx-debian.html;

    location / {
        try_files $uri $uri/ =404;
    }

    error_log /var/log/nginx/jeanhua.cn-error.log;
    access_log /var/log/nginx/jeanhua.cn-access.log;
}
```

### 2. 启用配置并测试

创建符号链接以启用这些配置，并测试 Nginx 配置的正确性。

```bash
sudo ln -s /etc/nginx/sites-available/blog.jeanhua.cn /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/jeanhua.cn /etc/nginx/sites-enabled/

sudo nginx -t
```

如果测试通过，重新加载 Nginx 以应用更改。

```bash
sudo systemctl reload nginx
```

## 三、配置 HTTPS

为了提升网站安全性，我们需要配置 HTTPS。这里我们使用 Certbot 来获取 Let’s Encrypt 的 SSL 证书。

### 1. 安装 Certbot

```bash
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx
```

### 2. 获取 SSL 证书并配置 HTTPS

使用 Certbot 自动获取 SSL 证书并配置 Nginx 以启用 HTTPS。

```bash
sudo certbot --nginx -d blog.jeanhua.cn -d www.blog.jeanhua.cn
sudo certbot --nginx -d jeanhua.cn -d www.jeanhua.cn
```

Certbot 将自动修改 Nginx 配置文件，为每个域名添加 HTTPS 虚拟主机配置。过程中，Certbot 可能会询问你一些问题，比如你的电子邮件地址和是否需要自动重定向 HTTP 流量到 HTTPS。

### 3. 验证配置

你可以通过查看 Nginx 的配置文件来验证 Certbot 所做的更改。

```bash
sudo nano /etc/nginx/sites-enabled/blog.jeanhua.cn
sudo nano /etc/nginx/sites-enabled/jeanhua.cn
```

你应该会看到为每个域名添加的 HTTPS 虚拟主机配置。

## 四、配置端口转发（可选）

如果你需要将子域名转发到本地某端口，可以使用 Nginx 的反向代理功能。

### 1. 编辑配置文件

在 Nginx 的配置文件中添加反向代理设置。例如，为 `test.jeanhua.cn` 添加以下配置：

```bash
sudo nano /etc/nginx/sites-available/test.jeanhua.cn
```

添加以下内容：

```nginx
server {
    listen 80;
    server_name test.jeanhua.cn www.test.jeanhua.cn;

    location / {
        proxy_pass http://localhost:1234;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    error_log /var/log/nginx/test.jeanhua.cn-error.log;
    access_log /var/log/nginx/test.jeanhua.cn-access.log;
}
```

### 2. 启用配置并测试

创建符号链接以启用配置，并测试 Nginx 配置的正确性。

```bash
sudo ln -s /etc/nginx/sites-available/test.jeanhua.cn /etc/nginx/sites-enabled/
sudo nginx -t
```

如果测试通过，重新加载 Nginx 以应用更改。

```bash
sudo systemctl reload nginx
```

### 3. 配置 HTTPS（可选）

如果你希望为反向代理也配置 HTTPS，可以按照前面的步骤使用 Certbot 获取 SSL 证书并配置 Nginx。Certbot 将自动处理 HTTPS 的配置。