---
title: 【专栏】4.python数据结构
date: 2025-04-19 18:09:15
tags:
- python
- 教程
categories:
- [编程笔记,python]
---

## Python数据结构

### 一、数据结构概述

1. Python主要数据结构分类

| 数据结构 | 可变性 | 有序性 | 元素要求 | 示例 |
|----------|--------|--------|----------|------|
| 列表(list) | 可变 | 有序 | 无 | [1, 2, 3] |
| 元组(tuple) | 不可变 | 有序 | 无 | (1, 2, 3) |
| 字典(dict) | 可变 | 无序(3.7+有序插入) | 键必须可哈希 | {'a':1, 'b':2} |
| 集合(set) | 可变 | 无序 | 必须可哈希 | {1, 2, 3} |
| 字符串(str) | 不可变 | 有序 | 字符 | "hello" |

2. 选择数据结构的考量因素

• 数据是否需要修改：可变 vs 不可变

• 是否需要保持插入顺序

• 是否需要快速查找

• 数据元素的唯一性要求

• 内存使用效率


### 二、列表(List)：最灵活的有序集合

1. 列表基础操作

```python
# 创建列表
numbers = [1, 2, 3, 4, 5]
mixed = [1, "hello", 3.14, True]

# 访问元素
print(numbers[0])   # 1 (正向索引)
print(numbers[-1])  # 5 (负向索引)

# 修改元素
numbers[1] = 20

# 切片操作
print(numbers[1:4])  # [20, 3, 4]
print(numbers[:3])   # [1, 20, 3]
print(numbers[2:])   # [3, 4, 5]
```

2. 常用列表方法

```python
fruits = ["apple", "banana"]

# 添加元素
fruits.append("orange")     # 末尾添加
fruits.insert(1, "pear")    # 指定位置插入

# 删除元素
fruits.remove("banana")     # 按值删除
popped = fruits.pop(1)      # 按索引删除并返回
del fruits[0]               # 按索引删除

# 其他操作
fruits.extend(["grape", "kiwi"])  # 扩展列表
fruits.reverse()            # 反转列表
fruits.sort()               # 排序
print(fruits.count("apple")) # 计数
print(fruits.index("kiwi")) # 查找索引
```

3. 列表推导式

```python
# 创建平方数列表
squares = [x**2 for x in range(10)]

# 带条件的列表推导式
even_squares = [x**2 for x in range(10) if x % 2 == 0]

# 嵌套列表推导式
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
flattened = [num for row in matrix for num in row]
```

4. 列表性能考虑

• 时间复杂度：

  • 索引/赋值：O(1)

  • append/pop：O(1)

  • insert/remove：O(n)

• 内存预分配：列表会预留额外空间以减少频繁扩容

• 浅拷贝与深拷贝：


```python
import copy

original = [[1, 2], [3, 4]]
shallow = copy.copy(original)    # 浅拷贝
deep = copy.deepcopy(original)    # 深拷贝
```

### 三、元组(Tuple)：不可变有序集合

1. 元组基本特性

```python
# 创建元组
coordinates = (10, 20)
single_element = (42,)  # 注意逗号
empty_tuple = ()

# 元组解包
x, y = coordinates
print(x)  # 10

# 交换变量值
a, b = 1, 2
a, b = b, a
```

2. 元组与列表的比较

| 特性 | 列表 | 元组 |
|------|------|------|
| 可变性 | 可变 | 不可变 |
| 内存占用 | 较大 | 较小 |
| 安全性 | 较低 | 较高 |
| 使用场景 | 需要修改的数据 | 固定数据、字典键 |

3. 命名元组

```python
from collections import namedtuple

# 创建命名元组类型
Point = namedtuple('Point', ['x', 'y'])

# 实例化
p = Point(10, 20)
print(p.x, p.y)  # 10 20
```

### 四、字典(Dict)：高效的键值对存储

1. 字典基础操作

```python
# 创建字典
person = {"name": "Alice", "age": 25}
empty_dict = {}

# 访问元素
print(person["name"])  # "Alice"
print(person.get("height", 170))  # 安全访问，返回默认值

# 添加/修改元素
person["email"] = "alice@example.com"
person["age"] = 26

# 删除元素
del person["age"]
popped_value = person.pop("name")
```

2. 字典方法

```python
student = {"name": "Bob", "age": 20}

# 获取键、值、键值对
print(student.keys())    # dict_keys(['name', 'age'])
print(student.values())  # dict_values(['Bob', 20])
print(student.items())   # dict_items([('name', 'Bob'), ('age', 20)])

# 更新字典
student.update({"age": 21, "grade": "A"})

# 字典推导式
squares = {x: x**2 for x in range(5)}
```

3. 字典视图对象

Python 3中的keys(), values(), items()返回视图对象：

```python
d = {'a': 1, 'b': 2}
keys = d.keys()

d['c'] = 3
print(keys)  # 自动更新，包含'c'
```

4. 有序字典

```python
from collections import OrderedDict

# 保持插入顺序
ordered = OrderedDict()
ordered['a'] = 1
ordered['b'] = 2
ordered['c'] = 3
```

5. 默认字典

```python
from collections import defaultdict

# 自动初始化默认值
word_counts = defaultdict(int)
for word in ["apple", "banana", "apple"]:
    word_counts[word] += 1
```

### 五、集合(Set)：唯一元素的无序集合

1. 集合基础

```python
# 创建集合
primes = {2, 3, 5, 7}
empty_set = set()  # 不能用{},怎么写的话会认为是空字典，{"a":1}这种字典，{"a",1}这种是集合

# 添加/删除元素
primes.add(11)
primes.remove(2)  # 不存在会报错
primes.discard(3)  # 安全删除

# 集合运算
a = {1, 2, 3}
b = {3, 4, 5}

print(a | b)  # 并集 {1, 2, 3, 4, 5}
print(a & b)  # 交集 {3}
print(a - b)  # 差集 {1, 2}
print(a ^ b)  # 对称差集 {1, 2, 4, 5}
```

2. 集合推导式

```python
words = ["apple", "banana", "apple", "orange"]
unique_lengths = {len(word) for word in words}  # {5, 6}
```

3. 不可变集合

```python
frozen = frozenset([1, 2, 3])
# frozen.add(4)  # 报错，不可变
```

### 六、高级数据结构

1. 堆队列(heapq)

```python
import heapq

nums = [5, 7, 9, 1, 3]
heapq.heapify(nums)  # 转换为堆

print(heapq.heappop(nums))  # 1 (最小元素)
heapq.heappush(nums, 2)
```

2. 双端队列(deque)

```python
from collections import deque

d = deque([1, 2, 3])
d.appendleft(0)  # 左侧添加
d.extendleft([-1, -2])  # 左侧扩展
d.rotate(1)      # 旋转
```

3. 计数器(Counter)

```python
from collections import Counter

words = ["apple", "banana", "apple", "orange"]
word_counts = Counter(words)
print(word_counts.most_common(2))  # [('apple', 2), ('banana', 1)]
```

### 七、数据结构选择指南

1. 常见场景推荐

| 需求 | 推荐数据结构 |
|------|--------------|
| 快速查找/映射 | 字典 |
| 唯一元素存储 | 集合 |
| 有序数据，频繁修改 | 列表 |
| 固定数据，作为键 | 元组 |
| 先进先出队列 | deque |
| 优先级队列 | heapq |
| 元素计数 | Counter |

2. 性能优化技巧

1. 预分配列表空间：`lst = [None] * 1000`
2. 使用生成器表达式处理大数据：`sum(x**2 for x in range(1000000))`
3. 字典代替多个if-else：使用字典查找代替复杂条件判断
4. 集合去重：最快去重方法`list(set(duplicates))`
5. 利用切片：避免不必要的列表复制

### 八、实际应用案例

1. 使用字典统计词频

```python
def word_frequency(text):
    word_count = {}
    for word in text.lower().split():
        word_count[word] = word_count.get(word, 0) + 1
    return word_count
```

2. 使用集合检查重复

```python
def has_duplicates(items):
    return len(items) != len(set(items))
```

3. 使用堆实现Top K问题

```python
import heapq

def top_k_largest(nums, k):
    return heapq.nlargest(k, nums)
```

4. 使用双端队列实现滑动窗口

```python
from collections import deque

def sliding_window_max(nums, k):
    dq = deque()
    result = []
    
    for i, num in enumerate(nums):
        while dq and nums[dq[-1]] <= num:
            dq.pop()
        dq.append(i)
        
        if dq[0] == i - k:
            dq.popleft()
            
        if i >= k - 1:
            result.append(nums[dq[0]])
    
    return result
```
