---
title: 【专栏】6.python文件操作与异常处理
date: 2025-04-19 18:09:55
tags:
- python
- 教程
categories:
- [编程笔记,python]
---

## Python文件操作与异常处理

### 一、文件基础操作

1. 文件打开与关闭

使用`open()`函数打开文件，完成后必须关闭：

```python
# 传统方式（需要手动关闭）
file = open('example.txt', 'r')
try:
    content = file.read()
finally:
    file.close()

# 推荐方式（使用with语句自动关闭）
with open('example.txt', 'r') as file:
    content = file.read()
# 文件会在with块结束后自动关闭
```

2. 文件打开模式

| 模式 | 描述 |
|------|------|
| 'r'  | 只读（默认） |
| 'w'  | 写入（覆盖） |
| 'x'  | 独占创建（文件存在则失败） |
| 'a'  | 追加 |
| 'b'  | 二进制模式 |
| 't'  | 文本模式（默认） |
| '+'  | 读写模式 |

组合示例：`'rb'`（二进制只读），`'w+'`（读写，覆盖）

3. 文件读写方法

读取操作

```python
with open('example.txt', 'r') as f:
    # 读取整个文件
    content = f.read()
    
    # 读取一行
    line = f.readline()
    
    # 读取所有行（返回列表）
    lines = f.readlines()
    
    # 逐行迭代（内存高效）
    for line in f:
        print(line.strip())
```

写入操作

```python
with open('output.txt', 'w') as f:
    # 写入字符串
    f.write("Hello, World!\n")
    
    # 写入多行
    lines = ["Line 1\n", "Line 2\n", "Line 3\n"]
    f.writelines(lines)
    
    # 注意：writelines不会自动添加换行符
```

4. 文件指针操作

```python
with open('example.txt', 'rb+') as f:
    # 获取当前位置
    pos = f.tell()
    
    # 移动指针
    f.seek(10)  # 移动到第10字节
    f.seek(5, 1)  # 从当前位置移动5字节
    f.seek(-3, 2)  # 从文件末尾移动3字节
    
    # 读取当前位置后的内容
    chunk = f.read(20)  # 读取20字节
```

### 二、目录与文件系统操作

1. os模块基础

```python
import os

# 获取当前工作目录
cwd = os.getcwd()

# 改变工作目录
os.chdir('/path/to/directory')

# 列出目录内容
files = os.listdir('.')

# 创建/删除目录
os.mkdir('new_dir')
os.makedirs('path/to/new_dir', exist_ok=True)  # 递归创建
os.rmdir('empty_dir')
```

2. pathlib模块（Python 3.4+）

更面向对象的路径操作方式：

```python
from pathlib import Path

# 创建Path对象
p = Path('example.txt')

# 常用操作
print(p.exists())  # 是否存在
print(p.is_file())  # 是否是文件
print(p.is_dir())   # 是否是目录
print(p.suffix)     # 扩展名
print(p.stem)       # 不带扩展名的文件名

# 读写文件
content = p.read_text()
p.write_text('New content')

# 路径组合
new_p = p.parent / 'subdir' / 'newfile.txt'
```

3. 文件信息与权限

```python
import os
import stat
import time

# 获取文件状态
file_stat = os.stat('example.txt')

print(f"大小: {file_stat.st_size} 字节")
print(f"最后修改时间: {time.ctime(file_stat.st_mtime)}")
print(f"权限: {oct(file_stat.st_mode)[-3:]}")

# 修改权限
os.chmod('example.txt', stat.S_IRUSR | stat.S_IWUSR)  # 用户读写
```

4. 文件遍历与搜索

```python
from pathlib import Path

# 递归遍历目录
for file in Path('.').rglob('*.py'):
    print(file)

# 使用glob模式匹配
for file in Path('.').glob('**/*.txt'):
    print(file)
```

### 三、异常处理机制

1. 基本异常处理

```python
try:
    # 可能引发异常的代码
    result = 10 / 0
except ZeroDivisionError:
    # 处理特定异常
    print("不能除以零！")
except (TypeError, ValueError) as e:
    # 处理多种异常
    print(f"类型或值错误: {e}")
except Exception as e:
    # 处理所有其他异常
    print(f"未知错误: {e}")
else:
    # 没有异常时执行
    print("计算成功")
finally:
    # 无论是否异常都会执行
    print("清理资源")
```

2. 常见内置异常

| 异常 | 描述 |
|------|------|
| `FileNotFoundError` | 文件不存在 |
| `PermissionError` | 权限不足 |
| `IsADirectoryError` | 预期文件但得到目录 |
| `NotADirectoryError` | 预期目录但得到文件 |
| `IOError` | 输入输出错误 |
| `OSError` | 操作系统相关错误 |
| `ValueError` | 值无效 |
| `TypeError` | 类型错误 |
| `KeyError` | 字典键不存在 |
| `IndexError` | 序列索引超出范围 |

3. 自定义异常

```python
class InvalidDataError(Exception):
    """自定义异常类"""
    def __init__(self, message, data):
        super().__init__(message)
        self.data = data

def process_data(data):
    if not data:
        raise InvalidDataError("数据不能为空", data)
    # 处理数据...

try:
    process_data(None)
except InvalidDataError as e:
    print(f"错误: {e}, 数据: {e.data}")
```

4. 异常链

```python
try:
    # 一些操作
    open("nonexistent.txt")
except FileNotFoundError as e:
    raise RuntimeError("处理文件时出错") from e
```

### 四、文件操作中的异常处理

1. 安全的文件操作模式

```python
def safe_read_file(filename):
    try:
        with open(filename, 'r') as f:
            return f.read()
    except FileNotFoundError:
        print(f"文件 {filename} 不存在")
        return None
    except PermissionError:
        print(f"没有权限读取文件 {filename}")
        return None
    except UnicodeDecodeError:
        print(f"文件 {filename} 编码错误")
        return None
```

2. 原子写入模式

确保写入操作要么完全成功，要么完全不修改文件：

```python
import os
from tempfile import NamedTemporaryFile

def atomic_write(filename, data):
    # 创建临时文件
    with NamedTemporaryFile('w', dir=os.path.dirname(filename), delete=False) as f:
        tempname = f.name
        try:
            f.write(data)
            f.flush()
            os.fsync(f.fileno())  # 确保写入磁盘
            
            # 替换原文件
            os.replace(tempname, filename)
        except:
            # 发生错误时删除临时文件
            os.unlink(tempname)
            raise
```

3. 文件锁（跨进程安全）

```python
import fcntl

def locked_write(filename, data):
    with open(filename, 'a') as f:
        try:
            fcntl.flock(f, fcntl.LOCK_EX)  # 获取排他锁
            f.write(data)
        finally:
            fcntl.flock(f, fcntl.LOCK_UN)  # 释放锁
```

### 五、高级文件处理技术

1. 内存映射文件

处理大文件的高效方式：

```python
import mmap

with open('large_file.bin', 'r+b') as f:
    # 创建内存映射
    mm = mmap.mmap(f.fileno(), 0)
    
    # 像操作内存一样操作文件
    print(mm[:10])  # 读取前10字节
    mm[10:20] = b'x' * 10  # 修改10字节
    
    # 关闭映射
    mm.close()
```

2. 临时文件与目录

```python
from tempfile import TemporaryFile, NamedTemporaryFile, TemporaryDirectory

# 匿名临时文件（不可见于文件系统）
with TemporaryFile('w+t') as f:
    f.write('临时内容')
    f.seek(0)
    print(f.read())

# 具名临时文件
with NamedTemporaryFile('w+t', suffix='.tmp', delete=False) as f:
    print(f"临时文件路径: {f.name}")
    f.write('具名临时内容')

# 临时目录
with TemporaryDirectory() as tmpdir:
    print(f"临时目录: {tmpdir}")
    # 在目录中创建文件...
```

3. 压缩文件处理

```python
import gzip
import zipfile

# Gzip压缩
with gzip.open('example.txt.gz', 'wt') as f:
    f.write('压缩内容')

# Zip压缩
with zipfile.ZipFile('archive.zip', 'w') as zf:
    zf.write('file1.txt')
    zf.write('file2.txt')

# 解压Zip
with zipfile.ZipFile('archive.zip', 'r') as zf:
    zf.extractall('extracted_files')
```

### 六、实际应用案例

1. 配置文件解析器

```python
import configparser

def load_config(config_path):
    config = configparser.ConfigParser()
    
    try:
        if not os.path.exists(config_path):
            raise FileNotFoundError(f"配置文件 {config_path} 不存在")
            
        config.read(config_path)
        return {
            'database': {
                'host': config.get('database', 'host'),
                'port': config.getint('database', 'port'),
                'user': config.get('database', 'user', fallback='admin')
            }
        }
    except (configparser.Error, ValueError) as e:
        raise RuntimeError(f"配置文件格式错误: {e}") from e
```

2. 日志文件轮转

```python
import logging
from logging.handlers import RotatingFileHandler

def setup_logging(log_file='app.log', max_size=10*1024*1024, backup_count=5):
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)
    
    # 创建轮转处理器
    handler = RotatingFileHandler(
        log_file, maxBytes=max_size, backupCount=backup_count
    )
    formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
    handler.setFormatter(formatter)
    
    logger.addHandler(handler)
    
    # 添加控制台输出
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)
```

3. CSV文件安全处理

```python
import csv
from pathlib import Path

def read_csv_safely(file_path):
    try:
        file_path = Path(file_path)
        if file_path.suffix.lower() != '.csv':
            raise ValueError("文件必须是CSV格式")
            
        with open(file_path, 'r', newline='', encoding='utf-8') as f:
            # 检测可能的CSV注入
            sample = f.read(1024)
            if any(char in sample for char in ['=', '+', '-', '@']):
                raise ValueError("CSV文件可能包含危险内容")
                
            f.seek(0)
            reader = csv.DictReader(f)
            return [row for row in reader]
            
    except UnicodeDecodeError:
        raise ValueError("文件编码不支持") from None
    except csv.Error as e:
        raise ValueError(f"CSV格式错误: {e}") from None
```