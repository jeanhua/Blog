---
title: 【专栏】1.python入门
date: 2025-04-19 17:29:51
tags:
- python
- 教程
categories:
- [编程笔记,python]
---

示例

```python
# 第一个Python程序
print("Hello, Python World!")  # 在屏幕打印文字

# 查看Python版本（重要！）
import sys
print(f"\n当前Python版本：{sys.version}")

# 数学计算演示
print(f"\n3的平方是：{3**2}")  # 双星号表示幂运算
```

详细解说

1️⃣ 环境安装（3种推荐方式）
• 标准安装（适合所有人）：

  • 官网 [python.org](https://www.python.org/downloads/) 下载最新稳定版（如3.11.x）

  • 安装时务必勾选 `Add Python to PATH`（环境变量配置）


• 科学计算推荐（含数据分析包）：

  • 安装 [Anaconda](https://www.anaconda.com/download)（自带Jupyter Notebook）


• 极简体验（免安装）：

  • 使用在线环境 [python3在线运行,在线工具，在线编译IDE_w3cschool](https://www.w3cschool.cn/tryrun/runcode?lang=python3)（无需配置）


> 💡 验证安装：终端输入 `python --version` 应返回版本号

2️⃣ 开发工具选择

| 工具    | 适用场景 | 特点          |
| ------- | -------- | ------------- |
| VS Code | 通用开发 | 轻量+插件扩展 |
| PyCharm | 大型项目 | 专业IDE       |
| Jupyter | 数据分析 | 交互式笔记本  |

```python
# 用Jupyter的独有功能演示（单元格魔法命令）
# 在Jupyter中运行：
# %timeit [x**2 for x in range(1000)]  # 测量代码执行时间
```

3️⃣ 代码结构解析
```python
# 注释说明（不会被执行）
print("这段代码会被执行")  # 行内注释用#号

"""
多行注释
用三个引号包围
"""

# 代码块通过缩进表示层级
if True:
    print("缩进相同的属于同一代码块")
    print("通常用4个空格或1个Tab")
```

4️⃣ 常见问题排查
```python
# 故意制造一个错误（观察报错信息）
# print("忘记闭合引号)   # SyntaxError提示
```

高频问题：
1. `SyntaxError: invalid syntax` → 检查符号是否成对（引号/括号）
2. `IndentationError` → 检查缩进是否一致
3. 中文乱码 → 文件开头添加 `# -*- coding: utf-8 -*-`
