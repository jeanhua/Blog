---
title: 【专栏】7.python面向对象编程（OOP）
date: 2025-04-19 18:10:16
tags:
- python
- 教程
categories:
- [编程笔记,python]
---

## Python面向对象编程（OOP）

### 一、类与对象基础

1. 类定义与实例化

```python
class Dog:
    """Dog类的简单示例"""
    
    # 类属性（所有实例共享）
    species = "Canis familiaris"
    
    def __init__(self, name, age):
        """初始化方法（构造函数）"""
        self.name = name  # 实例属性
        self.age = age
    
    def description(self):
        """实例方法"""
        return f"{self.name} is {self.age} years old"
    
    def speak(self, sound):
        """带参数的实例方法"""
        return f"{self.name} says {sound}"

# 实例化
my_dog = Dog("Buddy", 5)
print(my_dog.description())  # Buddy is 5 years old
print(my_dog.speak("Woof!")) # Buddy says Woof!
```

2. 类与实例命名空间

• 类属性：所有实例共享，通过类或实例访问

• 实例属性：每个实例独有，优先于类属性


```python
class Example:
    class_attr = "类属性值"
    
    def __init__(self, instance_attr):
        self.instance_attr = instance_attr

obj1 = Example("实例1")
obj2 = Example("实例2")

print(obj1.class_attr)       # 类属性值
print(obj1.instance_attr)    # 实例1

Example.class_attr = "修改后的类属性"
print(obj2.class_attr)       # 修改后的类属性
```

3. 属性访问控制

Python中没有真正的私有属性，但有以下约定：

• 公有属性：`normal_name`

• 保护属性：`_protected_name`（约定，实际仍可访问）

• 私有属性：`__private_name`（名称修饰，实际变为`_ClassName__private_name`）


```python
class AccessExample:
    def __init__(self):
        self.public = "公共属性"
        self._protected = "保护属性"
        self.__private = "私有属性"

obj = AccessExample()
print(obj.public)        # 公共属性
print(obj._protected)     # 保护属性（不推荐直接访问）
# print(obj.__private)   # 报错：AttributeError
print(obj._AccessExample__private)  # 私有属性（实际访问方式）
```

### 二、继承与多态

1. 基本继承

```python
class Animal:
    def __init__(self, name):
        self.name = name
    
    def speak(self):
        raise NotImplementedError("子类必须实现此方法")

class Dog(Animal):
    def speak(self):
        return f"{self.name} says Woof!"

class Cat(Animal):
    def speak(self):
        return f"{self.name} says Meow!"

animals = [Dog("Buddy"), Cat("Misty")]
for animal in animals:
    print(animal.speak())
```

2. 方法重写与super()

```python
class Parent:
    def __init__(self, name):
        self.name = name
    
    def show(self):
        print(f"Parent method: {self.name}")

class Child(Parent):
    def __init__(self, name, age):
        super().__init__(name)  # 调用父类初始化
        self.age = age
    
    def show(self):
        super().show()  # 调用父类方法
        print(f"Child method: {self.name}, {self.age}")

child = Child("Alice", 10)
child.show()
```

3. 多重继承与方法解析顺序(MRO)

```python
class A:
    def show(self):
        print("A")

class B(A):
    def show(self):
        print("B")

class C(A):
    def show(self):
        print("C")

class D(B, C):
    pass

d = D()
d.show()  # 输出B（按MRO顺序）
print(D.mro())  # 显示方法解析顺序
```

### 三、特殊方法与运算符重载

1. 常用特殊方法

| 方法 | 描述 | 调用方式 |
|------|------|----------|
| `__init__` | 构造函数 | `obj = Class()` |
| `__str__` | 字符串表示 | `str(obj)`, `print(obj)` |
| `__repr__` | 官方字符串表示 | `repr(obj)` |
| `__len__` | 长度 | `len(obj)` |
| `__getitem__` | 索引访问 | `obj[key]` |
| `__setitem__` | 索引赋值 | `obj[key] = value` |
| `__delitem__` | 索引删除 | `del obj[key]` |
| `__iter__` | 迭代器协议 | `for x in obj` |
| `__eq__` | 相等比较 | `obj == other` |
| `__add__` | 加法运算 | `obj + other` |

2. 实现示例

```python
class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y
    
    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)
    
    def __sub__(self, other):
        return Vector(self.x - other.x, self.y - other.y)
    
    def __mul__(self, scalar):
        return Vector(self.x * scalar, self.y * scalar)
    
    def __eq__(self, other):
        return self.x == other.x and self.y == other.y
    
    def __str__(self):
        return f"Vector({self.x}, {self.y})"
    
    def __repr__(self):
        return f"Vector({self.x}, {self.y})"

v1 = Vector(2, 3)
v2 = Vector(4, 5)
print(v1 + v2)  # Vector(6, 8)
print(v1 * 3)   # Vector(6, 9)
```

### 四、类方法与静态方法

1. 实例方法 vs 类方法 vs 静态方法

| 类型 | 装饰器 | 第一个参数 | 访问权限 |
|------|--------|------------|----------|
| 实例方法 | 无 | `self`（实例引用） | 可访问实例和类 |
| 类方法 | `@classmethod` | `cls`（类引用） | 只能访问类 |
| 静态方法 | `@staticmethod` | 无 | 无特殊访问权限 |

2. 实现示例

```python
class MyClass:
    class_attr = "类属性"
    
    def __init__(self, instance_attr):
        self.instance_attr = instance_attr
    
    def instance_method(self):
        print(f"实例方法访问: {self.instance_attr}, {self.class_attr}")
    
    @classmethod
    def class_method(cls):
        print(f"类方法访问: {cls.class_attr}")
        # print(cls.instance_attr)  # 报错，无法访问实例属性
    
    @staticmethod
    def static_method():
        print("静态方法无需访问类或实例")

obj = MyClass("实例属性")
obj.instance_method()
MyClass.class_method()
MyClass.static_method()
```

### 五、属性装饰器与描述符

1. 属性装饰器

```python
class Circle:
    def __init__(self, radius):
        self._radius = radius
    
    @property
    def radius(self):
        """获取半径"""
        return self._radius
    
    @radius.setter
    def radius(self, value):
        """设置半径，必须为正数"""
        if value <= 0:
            raise ValueError("半径必须为正数")
        self._radius = value
    
    @property
    def area(self):
        """计算面积（只读属性）"""
        return 3.14 * self._radius ** 2

circle = Circle(5)
print(circle.radius)  # 5
circle.radius = 10    # 调用setter
print(circle.area)    # 314.0
# circle.area = 100   # 报错：AttributeError
```

2. 描述符协议

描述符是实现`__get__`、`__set__`或`__delete__`方法的类：

```python
class PositiveNumber:
    def __init__(self, name):
        self.name = name
    
    def __get__(self, instance, owner):
        return instance.__dict__[self.name]
    
    def __set__(self, instance, value):
        if value <= 0:
            raise ValueError("必须为正数")
        instance.__dict__[self.name] = value

class Rectangle:
    width = PositiveNumber("width")
    height = PositiveNumber("height")
    
    def __init__(self, width, height):
        self.width = width
        self.height = height

rect = Rectangle(10, 20)
print(rect.width)  # 10
# rect.width = -5  # 报错：ValueError
```

### 六、抽象基类(ABC)

```python
from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self):
        pass
    
    @abstractmethod
    def perimeter(self):
        pass

class Rectangle(Shape):
    def __init__(self, width, height):
        self.width = width
        self.height = height
    
    def area(self):
        return self.width * self.height
    
    def perimeter(self):
        return 2 * (self.width + self.height)

# shape = Shape()  # 报错：不能实例化抽象类
rect = Rectangle(5, 10)
print(rect.area())  # 50
```

### 七、常见设计模式实现

1. 单例模式

```python
class Singleton:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

a = Singleton()
b = Singleton()
print(a is b)  # True
```

2. 工厂模式

```python
class Dog:
    def speak(self):
        return "Woof!"

class Cat:
    def speak(self):
        return "Meow!"

def get_pet(pet="dog"):
    pets = {
        "dog": Dog(),
        "cat": Cat()
    }
    return pets[pet]

dog = get_pet("dog")
print(dog.speak())  # Woof!
```

3. 观察者模式

```python
class Subject:
    def __init__(self):
        self._observers = []
    
    def attach(self, observer):
        self._observers.append(observer)
    
    def detach(self, observer):
        self._observers.remove(observer)
    
    def notify(self):
        for observer in self._observers:
            observer.update(self)

class Observer:
    def update(self, subject):
        pass

class TemperatureSensor(Subject):
    def __init__(self):
        super().__init__()
        self._temperature = 0
    
    @property
    def temperature(self):
        return self._temperature
    
    @temperature.setter
    def temperature(self, value):
        self._temperature = value
        self.notify()

class Display(Observer):
    def update(self, subject):
        print(f"温度更新: {subject.temperature}°C")

sensor = TemperatureSensor()
display = Display()
sensor.attach(display)

sensor.temperature = 25  # 温度更新: 25°C
sensor.temperature = 30  # 温度更新: 30°C
```
