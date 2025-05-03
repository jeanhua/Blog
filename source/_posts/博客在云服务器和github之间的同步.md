---
title: 博客在云服务器和github之间的同步
date: 2024-09-14 23:05:15
tags:
- 服务器
- 博客
- ssh
- python
categories:
- 方法论
---

博客框架 **hexo**，网页服务器 **apache2**

因为我的博客是放在云服务上的，然后又希望在GitHub上面同步，传统的办法是使用git把public里面的文件放到GitHub上面，然后手动将文件复制到云服务上，这就有一个问题，就是当文章删除的时候会导致删不掉，同时也很繁杂。

<!-- more -->

网上有的办法普遍是在云服务上面弄个git仓库，总之一堆**心烦意乱**的配置，于是我在想有没有更**简单**的办法

🤣**还真有**

只要本地仓库push到github，然后云服务器pull一下不就行了，直截了当

但是手动push然后pull确实也麻烦

python启动！

```python
import paramiko
import os

# 处理本地数据
with open("do.bat",'w',encoding='utf-8') as f:
    f.write("hexo clean && hexo g && hexo deploy") #不知道为什么python的os.system()会报错，所以写一个bat算了
    f.close()

os.system(".\\do.bat")
print("本地处理完成")
# SSH连接信息
hostname = '192.168.1.1' #这里填写服务器ip
port = 22  # 默认SSH端口是22，根据实际情况修改
username = 'root'#这里换成账户
password = '******'#这里换成你的云服务器密码
command = 'cd /var/www/blog/ && git pull origin main' #换成云服务对应的仓库地址

# 创建SSH对象
ssh = paramiko.SSHClient()

# 允许连接不在know_hosts文件中的主机
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

# 连接服务器
ssh.connect(hostname, port, username, password)

# 执行命令
stdin, stdout, stderr = ssh.exec_command(command)
print("输出：", stdout.read().decode())
print("错误：", stderr.read().decode())

# 关闭连接
ssh.close()
print("完成")
```

完工！

---

## 后续：

**上面的方法比较慢，可以在服务器端部署一个web监听，使用github的webhook自动触发更新**
