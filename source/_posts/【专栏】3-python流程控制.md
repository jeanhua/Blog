---
title: 【专栏】3.python流程控制
date: 2025-04-19 17:48:41
tags:
- python
- 教程
categories:
- [编程笔记,python]
---



## Python流程控制

一、条件语句：if-elif-else

条件语句允许程序根据不同的条件执行不同的代码块。

基本语法

```python
if 条件1:
    # 条件1为真时执行的代码
elif 条件2:
    # 条件1为假且条件2为真时执行的代码
else:
    # 所有条件都为假时执行的代码
```

示例

```python
age = 18

if age < 13:
    print("儿童")
elif age < 18:
    print("青少年")
else:
    print("成人")
```

注意事项
1. `elif`和`else`是可选的
2. 可以使用嵌套的if语句处理更复杂的条件
3. Python中没有switch-case语句，可以用if-elif-else或字典映射替代

二、循环结构

循环允许我们重复执行一段代码，Python中有两种主要的循环结构。

1. while循环

while循环在条件为真时重复执行代码块。

```python
count = 0
while count < 5:
    print(f"这是第{count+1}次循环")
    count += 1
```

2. for循环

for循环用于遍历序列（如列表、元组、字符串等）或其他可迭代对象。

```python
fruits = ["苹果", "香蕉", "橙子"]
for fruit in fruits:
    print(f"我喜欢吃{fruit}")
```

循环控制语句

• `break`: 立即退出整个循环

• `continue`: 跳过当前迭代，进入下一次循环

• `else`: 当循环正常结束（非break退出）时执行


```python
for num in range(10):
    if num == 5:
        break  # 当num等于5时退出循环
    print(num)
else:
    print("循环正常结束")  # 不会执行，因为循环被break中断
```

三、异常处理：try-except

异常处理允许程序在遇到错误时优雅地处理，而不是直接崩溃。

基本语法

```python
try:
    # 可能引发异常的代码
except 异常类型:
    # 处理异常的代码
else:
    # 没有异常时执行的代码
finally:
    # 无论是否发生异常都会执行的代码
```

示例

```python
try:
    result = 10 / 0
except ZeroDivisionError:
    print("不能除以零！")
else:
    print("结果是:", result)
finally:
    print("计算完成")
```

四、实践应用

1. 用户输入验证

```python
while True:
    try:
        age = int(input("请输入您的年龄: "))
        if age < 0:
            print("年龄不能为负数！")
            continue
        break
    except ValueError:
        print("请输入有效的数字！")

print(f"您输入的年龄是: {age}")
```

2. 遍历字典

```python
person = {"name": "张三", "age": 25, "city": "北京"}

for key, value in person.items():
    print(f"{key}: {value}")
```

3. 列表推导式中的条件

```python
numbers = [1, 2, 3, 4, 5, 6]
even_squares = [x**2 for x in numbers if x % 2 == 0]
print(even_squares)  # 输出: [4, 16, 36]
```

五、注意事项

1. 避免深层嵌套：过多的嵌套会使代码难以阅读，考虑使用函数分解复杂逻辑
2. 明确循环条件：确保while循环有明确的退出条件，避免无限循环
3. 捕获特定异常：不要使用过于宽泛的异常捕获，这可能会掩盖真正的问题
4. 合理使用else：循环和try语句中的else子句可以增加代码可读性
5. 优先使用for循环：当循环次数已知或需要遍历序列时，for循环通常比while更清晰
