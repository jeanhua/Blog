---
title: 【专栏】2.python变量与数据类型
date: 2025-04-19 17:37:41
tags:
- python
- 教程
categories:
- [编程笔记,python]
---

## Python变量与数据类型

### 一、变量基础

1. 什么是变量？

变量是存储数据的容器，可以理解为数据的"标签"或"名字"。在Python中，变量不需要提前声明类型，赋值时会自动确定类型。

2. 变量命名规则

• 只能包含字母、数字和下划线（A-z, 0-9, _）

• 不能以数字开头

• 不能使用Python关键字（如if, for, while等）

• 区分大小写（age和Age是不同的变量）

• 推荐使用描述性名称（如user_name而非un）


3. 变量赋值

Python使用等号(=)进行赋值：

```python
# 简单赋值
counter = 100  
name = "张三"

# 多重赋值
x = y = z = 1  

# 同时给多个变量赋值
a, b, c = 1, 2, "hello"

# 变量可以覆盖赋值
a = 1
a = "Hel"
```

4. 变量类型检查

使用`type()`函数查看变量类型：

```python
age = 25
print(type(age))  # <class 'int'>
```

### 二、基本数据类型

Python有几种内置的基本数据类型：

1. 数字类型

整数(int)

```python
a = 10
b = -5
c = 0
```

浮点数(float)

```python
pi = 3.14159
temperature = -10.5
```

复数(complex)

```python
z = 3 + 5j
```

数字运算

```python
# 基本运算
print(10 + 3)  # 13
print(10 - 3)  # 7
print(10 * 3)  # 30
print(10 / 3)  # 3.333... (浮点除法)
print(10 // 3) # 3 (整数除法)
print(10 % 3)  # 1 (取模)
print(10 ** 3) # 1000 (幂运算)

# 类型转换
int_num = int(3.14)  # 3
float_num = float(5) # 5.0
```

2. 布尔类型(bool)

表示真(True)或假(False)，常用于条件判断：

```python
is_active = True
has_permission = False

# 布尔运算
print(True and False)  # False
print(True or False)   # True
print(not True)        # False
```

3. 字符串(str)

字符串是不可变的字符序列，可以用单引号或双引号创建：

基本操作

```python
name = "Alice"
greeting = 'Hello'

# 字符串拼接
full_greeting = greeting + ", " + name  # "Hello, Alice"

# 字符串重复
stars = "*" * 10  # "**********"

# 字符串长度
print(len(name))  # 5
```

字符串索引和切片

```python
s = "Python"

print(s[0])    # 'P' (第一个字符)
print(s[-1])   # 'n' (最后一个字符)
print(s[2:5])  # 'tho' (切片从2到4)
print(s[:3])   # 'Pyt' (从开始到2)
print(s[3:])   # 'hon' (从3到结束)
```

常用字符串方法

```python
text = " Hello, World! "

print(text.strip())      # "Hello, World!" (去除两端空格)
print(text.lower())      # " hello, world! " (转为小写)
print(text.upper())      # " HELLO, WORLD! " (转为大写)
print(text.replace("H", "J"))  # " Jello, World! "
print(text.split(","))   # [' Hello', ' World! '] (分割字符串)
print("Python".startswith("Py"))  # True
print("123".isdigit())   # True
```

4. None类型

表示空值或没有值：

```python
result = None
```

### 三、复合数据类型

1. 列表(list)

有序、可变的元素集合：

```python
fruits = ["apple", "banana", "cherry"]
numbers = [1, 2, 3, 4, 5]

# 基本操作
fruits.append("orange")  # 添加元素
fruits[1] = "blueberry"  # 修改元素
del fruits[0]            # 删除元素
print(len(fruits))       # 获取长度

# 列表切片
print(numbers[1:4])  # [2, 3, 4]

# 列表方法
nums = [3, 1, 4, 1, 5]
nums.sort()          # [1, 1, 3, 4, 5]
nums.reverse()       # [5, 4, 3, 1, 1]
print(nums.count(1)) # 2 (元素1出现的次数)
```

2. 元组(tuple)

有序、不可变的元素集合：

```python
coordinates = (10, 20)
colors = ("red", "green", "blue")

# 元组是不可变的，以下操作会报错
# coordinates[0] = 15  # TypeError

# 元组解包
x, y = coordinates
print(x)  # 10
```

3. 字典(dict)

键值对的集合，无序、可变：

```python
person = {
    "name": "Alice",
    "age": 25,
    "city": "New York"
}

# 访问元素
print(person["name"])  # "Alice"

# 添加/修改元素
person["email"] = "alice@example.com"
person["age"] = 26

# 删除元素
del person["city"]

# 字典方法
print(person.keys())    # 所有键
print(person.values())  # 所有值
print(person.items())   # 所有键值对
```

4. 集合(set)

无序、不重复的元素集合：

```python
unique_numbers = {1, 2, 3, 3, 4}  # {1, 2, 3, 4}

# 集合运算
a = {1, 2, 3}
b = {3, 4, 5}

print(a | b)  # 并集 {1, 2, 3, 4, 5}
print(a & b)  # 交集 {3}
print(a - b)  # 差集 {1, 2}
```

### 四、类型转换

Python提供了多种类型转换函数：

```python
# 转换为整数
print(int("123"))   # 123
print(int(3.14))    # 3

# 转换为浮点数
print(float("3.14"))  # 3.14
print(float(5))      # 5.0

# 转换为字符串
print(str(123))     # "123"
print(str(True))    # "True"

# 转换为布尔值
print(bool(1))      # True
print(bool(0))      # False
print(bool(""))     # False
print(bool("Hi"))   # True

# 转换为列表
print(list("hello"))  # ['h', 'e', 'l', 'l', 'o']
print(list({1, 2, 3})) # [1, 2, 3]
```

### 五、变量作用域

Python中的变量作用域分为：

1. 局部变量：在函数内部定义，只在函数内有效
2. 全局变量：在函数外部定义，整个程序都可访问

```python
global_var = "我是全局变量"

def test_scope():
    local_var = "我是局部变量"
    print(global_var)  # 可以访问全局变量
    print(local_var)   # 可以访问局部变量

test_scope()
# print(local_var)  # 报错，无法访问函数内的局部变量
```

要修改全局变量，需要使用`global`关键字：

```python
count = 0

def increment():
    global count
    count += 1

increment()
print(count)  # 1
```

### 六、提示

1. 使用描述性变量名：`user_age`比`ua`更易理解
2. 避免使用全局变量：除非必要，否则优先使用局部变量
3. 注意可变与不可变类型：列表可变，元组不可变
4. 合理选择数据类型：根据需求选择最适合的数据结构
5. 使用类型注解（Python 3.6+）：提高代码可读性

```python
def greet(name: str) -> str:
    return f"Hello, {name}"
```

###  七、高级特性与陷阱

可变与不可变类型

```python
不可变类型示例
s = "hello"
try:
    s[0] = "H"  # 报错：str不支持项赋值
except TypeError as e:
    print(e)

可变类型示例
lst = [1, 2, 3]
lst[0] = 100  # 合法操作
print(lst)

浅拷贝与深拷贝
import copy
original = [[1, 2], [3, 4]]
shallow = copy.copy(original)
deep = copy.deepcopy(original)
```

浮点数精度问题解决方案

```python
问题重现
print(0.1 + 0.2)  # 0.30000000000000004

解决方案1：四舍五入
print(round(0.1 + 0.2, 1))

解决方案2：decimal模块
from decimal import Decimal, getcontext
getcontext().prec = 6
print(Decimal('0.1') + Decimal('0.2'))

解决方案3：fractions模块
from fractions import Fraction
print(Fraction(1, 10) + Fraction(2, 10))
```

可变默认参数

```python
# 陷阱：可变默认参数
def add_item(item, lst=[]):  # 默认参数只创建一次！
    lst.append(item)
    return lst

print(add_item(1))  # [1]
print(add_item(2))  # [1, 2] （不是预期的[2]）
```

