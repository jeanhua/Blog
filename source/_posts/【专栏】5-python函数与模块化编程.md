---
title: 【专栏】5.python函数与模块化编程
date: 2025-04-19 18:09:41
tags:
- python
- 教程
categories:
- [编程笔记,python]
---

## Python函数与模块化编程

### 一、函数基础

1. 函数定义与调用

```python
def greet(name):
    """向指定名字的人打招呼"""
    return f"Hello, {name}!"

# 函数调用
message = greet("Alice")
print(message)  # Hello, Alice!
```

2. 函数参数

位置参数

```python
def power(base, exponent):
    return base ** exponent

print(power(2, 3))  # 8
```

关键字参数

```python
print(power(exponent=3, base=2))  # 8
```

默认参数

```python
def power(base, exponent=2):
    return base ** exponent

print(power(3))     # 9 (使用默认exponent=2)
print(power(3, 4))  # 81
```

可变参数

```python
# *args 接收任意数量的位置参数
def sum_numbers(*args):
    return sum(args)

print(sum_numbers(1, 2, 3))  # 6

# **kwargs 接收任意数量的关键字参数
def print_info(**kwargs):
    for key, value in kwargs.items():
        print(f"{key}: {value}")

print_info(name="Alice", age=25)
```

3. 返回值

• 函数可以返回多个值（实际上是返回一个元组）

• 没有return语句或return不带参数时返回None


```python
def min_max(numbers):
    return min(numbers), max(numbers)

smallest, largest = min_max([3, 1, 4, 1, 5])
print(smallest, largest)  # 1 5
```

### 二、函数高级特性

1. 函数作为一等公民

Python中函数是对象，可以：
• 赋值给变量

• 作为参数传递

• 作为返回值

• 存储在数据结构中


```python
def square(x):
    return x ** 2

# 赋值给变量
func = square
print(func(5))  # 25

# 作为参数
def apply_func(func, numbers):
    return [func(x) for x in numbers]

print(apply_func(square, [1, 2, 3]))  # [1, 4, 9]

# 作为返回值
def create_multiplier(n):
    def multiplier(x):
        return x * n
    return multiplier

double = create_multiplier(2)
print(double(5))  # 10
```

2. 匿名函数(lambda)

```python
# 语法：lambda 参数: 表达式
square = lambda x: x ** 2
print(square(5))  # 25

# 常用于排序等需要简单函数的场景
names = ["Alice", "Bob", "Charlie"]
names.sort(key=lambda x: len(x))
print(names)  # ['Bob', 'Alice', 'Charlie']
```

3. 闭包

闭包是能够访问其他函数作用域中变量的函数：

```python
def outer_func(message):
    def inner_func():
        print(message)
    return inner_func

my_func = outer_func("Hello")
my_func()  # Hello
```

4. 装饰器

装饰器是修改其他函数行为的函数：

```python
def timer(func):
    """计算函数执行时间的装饰器"""
    import time
    
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} executed in {end-start:.4f} seconds")
        return result
    return wrapper

@timer
def long_running_func():
    import time
    time.sleep(1)

long_running_func()  # 输出执行时间
```

5. 生成器函数

使用yield返回值的函数：

```python
def fibonacci(limit):
    a, b = 0, 1
    while a < limit:
        yield a
        a, b = b, a + b

for num in fibonacci(100):
    print(num)  # 0 1 1 2 3 5 8 13 21 34 55 89
```

### 三、模块化编程

1. 模块导入

导入整个模块

```python
import math
print(math.sqrt(16))  # 4.0
```

导入特定函数/类

```python
from math import sqrt, pi
print(sqrt(9))  # 3.0
```

导入并重命名

```python
import numpy as np
from math import factorial as fact
```

相对导入（在包内部）

```python
from . import module_name  # 当前目录
from .. import module_name  # 上级目录
```

2. 创建自定义模块

1. 创建`.py`文件（如`mymodule.py`）
2. 编写函数/类
3. 在其他文件中导入使用

```python
# mymodule.py
def greet(name):
    return f"Hello, {name}!"

# main.py
import mymodule
print(mymodule.greet("Alice"))
```

3. 包(Package)的组织

包是包含`__init__.py`文件的目录：

```
my_package/
│── __init__.py
│── module1.py
│── module2.py
│── subpackage/
│   │── __init__.py
│   │── module3.py
```

4. `__init__.py`的作用

• 标识目录为Python包

• 可以包含包初始化代码

• 控制`from package import *`的行为


```python
# __init__.py
__all__ = ['module1', 'module2']  # 控制*导入的内容
```

### 四、函数设计原则

1. 单一职责原则

一个函数只做一件事：

```python
# 不好
def process_data(data):
    # 清洗数据
    cleaned = []
    for item in data:
        cleaned.append(item.strip())
    
    # 分析数据
    total = sum(cleaned)
    average = total / len(cleaned)
    
    return average

# 更好
def clean_data(data):
    return [item.strip() for item in data]

def analyze_data(data):
    total = sum(data)
    return total / len(data)

# 使用
cleaned = clean_data(raw_data)
result = analyze_data(cleaned)
```

2. DRY原则（Don't Repeat Yourself）

避免重复代码，通过函数封装复用：

```python
# 重复代码
print("=" * 50)
print("Welcome to the system")
print("=" * 50)

# 封装后
def print_header(title):
    print("=" * 50)
    print(title)
    print("=" * 50)

print_header("Welcome to the system")
```

3. 函数命名规范

• 使用小写字母和下划线：`calculate_average`

• 动词开头表示动作：`get_user_info`

• 形容词+名词表示返回布尔值：`is_valid_input`


4. 文档字符串(Docstring)

```python
def calculate_circle_area(radius):
    """
    计算圆的面积
    
    参数:
        radius (float): 圆的半径，必须为非负数
        
    返回:
        float: 圆的面积
        
    抛出:
        ValueError: 如果半径为负数
    """
    if radius < 0:
        raise ValueError("Radius cannot be negative")
    return 3.14159 * radius ** 2
```

### 五、高级模块化技术

1. 动态导入

```python
module_name = "math"
math = __import__(module_name)
print(math.sqrt(16))
```

2. 重新加载模块

```python
import importlib
import mymodule
importlib.reload(mymodule)  # 强制重新加载
```

3. `__name__`与`__main__`

```python
# mymodule.py
def some_function():
    pass

if __name__ == "__main__":
    # 直接运行此文件时执行的代码
    print("Running as main program")
```

4. 包数据文件

通过`__file__`访问包内资源：

```python
import os

package_dir = os.path.dirname(__file__)
data_path = os.path.join(package_dir, 'data', 'file.txt')
```

### 六、测试与调试

1. 使用`assert`进行简单测试

```python
def add(a, b):
    return a + b

assert add(2, 3) == 5, "Addition test failed"
```

2. 使用`doctest`嵌入测试

```python
def factorial(n):
    """
    计算阶乘
    
    >>> factorial(5)
    120
    >>> factorial(0)
    1
    """
    if n == 0:
        return 1
    return n * factorial(n - 1)

if __name__ == "__main__":
    import doctest
    doctest.testmod()
```

3. 使用`logging`调试

```python
import logging

logging.basicConfig(level=logging.DEBUG)

def complex_calculation(x):
    logging.debug(f"Starting calculation with x={x}")
    result = x ** 2 + 2 * x + 1
    logging.debug(f"Calculation complete, result={result}")
    return result
```