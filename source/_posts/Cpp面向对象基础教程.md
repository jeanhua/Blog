---
title: 【速通】C++面向对象基础教程
date: 2025-04-18 23:33:14
tags:
- C++
- 编程教程
categories:
- [编程笔记,速通]
---

### **第一部分：C++与OOP基础**  （简介）

#### **1. 引言**  
• **为什么学习C++ OOP？**  
  • C++是高性能系统编程的核心语言，广泛应用于游戏引擎、操作系统、高频交易等领域。  
  • 面向对象编程（OOP）能更好地组织复杂代码，提高可维护性和扩展性。  
• **C++在工业界的应用场景**  
  • 举例：Unreal Engine（游戏）、LLVM/Clang（编译器）、数据库系统（如MySQL）。  
• **专栏学习路线说明**  
  • 从基础到进阶，结合理论、代码示例和实战项目，帮助读者掌握OOP核心思想。  

#### **2. C++快速回顾**  
• **基础语法**  
  • 变量、循环、条件语句、函数等基本语法。  
  • 强调C++是“C的超集”，但更强调类型安全和抽象能力。  
• **指针与引用**  
  • 指针：存储内存地址，支持动态内存管理。  
  • 引用：别名机制，常用于函数参数传递（避免拷贝）。  
• **`const`关键字**  
  • 修饰变量（不可修改）、函数（不修改成员变量）、指针（指向不可变数据）。  

#### **3. 面向对象编程核心概念**  
• **对象与类**  
  • 对象是数据和行为的封装，类是对象的蓝图。  
  • 示例：`Car`类（属性：`speed`，方法：`accelerate()`）。  
• **OOP四大特性**  
  • **封装**：隐藏内部实现，暴露接口。  
  • **继承**：代码复用，建立类之间的层次关系。  
  • **多态**：同一接口不同实现（如虚函数）。  
  • **抽象**：定义接口而不实现（纯虚函数）。  
• **OOP vs 面向过程（POP）**  
  • POP以函数为中心，OOP以对象为中心。  
  • OOP更适合大型项目，但可能引入额外开销。  

### **第二部分：类与对象**

#### **4. 类的定义与实现**

**4.1 类的基本结构**

```cpp
class Person {
private:    // 私有成员（默认）
    std::string name;
    int age;

public:     // 公有接口
    void setName(const std::string& n) { name = n; }
    void setAge(int a) { age = a; }
    void introduce() {
        std::cout << "I'm " << name << ", " << age << " years old.\n";
    }
};
```
• **成员变量**：描述对象属性（如`name`, `age`），通常设为`private`。
• **成员函数**：定义对象行为（如`setName`, `introduce`），通常设为`public`。

**4.2 访问控制**
| 修饰符      | 类内部 | 子类 | 外部代码 |
| ----------- | ------ | ---- | -------- |
| `private`   | ✔      | ✖    | ✖        |
| `protected` | ✔      | ✔    | ✖        |
| `public`    | ✔      | ✔    | ✔        |

**示例：银行账户封装**
```cpp
class BankAccount {
private:
    double balance;  // 隐藏内部数据

public:
    void deposit(double amount) {
        if (amount > 0) balance += amount;
    }
    bool withdraw(double amount) {
        if (amount <= balance) {
            balance -= amount;
            return true;
        }
        return false;
    }
};
```

**为什么要隐藏balance，因为我们不想让外部可以直接操作这个数值，而是提供一个Public函数来给外部，我们在这个函数里面可以检查或者进行其他操作再来由我们来改变，来保证数据的改变是合理的**

---

#### **5. 构造函数与析构函数**

**5.1 构造函数类型**

```cpp
class Student {
public:
    // 1. 默认构造函数
    Student() : id(0), name("Unknown") {} 

    // 2. 参数化构造函数
    Student(int i, std::string n) : id(i), name(n) {}

    // 3. 拷贝构造函数
    Student(const Student& other) : id(other.id), name(other.name) {}

private:
    int id;
    std::string name;
};
```

**5.2 初始化列表**
• 比构造函数体内赋值更高效（直接初始化而非先默认构造再赋值）：
```cpp
// 推荐方式
Student(int i, std::string n) : id(i), name(n) {}

// 不推荐方式
Student(int i, std::string n) { 
    id = i;    // 这里实际是赋值操作
    name = n;  // 可能触发临时对象构造
}
```

**5.3 析构函数**
```cpp
class FileHandler {
public:
    FileHandler(const char* filename) {
        file = fopen(filename, "r");
    }
    ~FileHandler() {
        if (file) fclose(file);  // 确保资源释放
    }
private:
    FILE* file;
};
```

**关键规则**：
• 如果类管理资源（内存、文件等），必须自定义析构函数
• 遵循Rule of Three：需要析构函数时，通常也需要拷贝构造和拷贝赋值

---

#### **6. 类的进阶特性**

**6.1 静态成员**
```cpp
class Counter {
public:
    static int count;  // 声明

    Counter() { count++; }
    ~Counter() { count--; }

    static void showCount() {  // 静态函数
        std::cout << "Total instances: " << count;
    }
};
int Counter::count = 0;  // 定义（必须在类外）
```

> 静态成员就是所有类对象共享同一个变量

比如：

```c++
Counter c1,c2;
c1.count = 1;
std::cout<<c2.count; //这里输出的是1
```



**6.2 友元函数**

友元就是虽然是private，但是给一个类或函数**特权**，让这个类或函数可以访问我们的数据

```cpp
class Matrix {
private:
    int data[2][2];
    friend Matrix multiply(const Matrix& a, const Matrix& b);  // 授权访问私有成员
};

Matrix multiply(const Matrix& a, const Matrix& b) {
    Matrix result;
    // 可以直接访问a.data和b.data
    return result;
}
```

**6.3 this指针**

**this就是指向这个类所示例化的对象的指针**，也可以用来区分参数和成员

```cpp
class Widget {
public:
    void setName(const std::string& name) {
        this->name = name;  // 区分同名参数和成员
    }
private:
    std::string name;
};
```

比如

```c++
Widget a,b; // 我们创建了两个示例对象
a.setName("哈基米"); //这里在调用时，内部的this就是指向 a 这个对象的指针
b.setName("胖猫");   //同理这里在调用时，内部的this就是指向 b 这个对象的指针
```



### **第三部分：OOP核心特性**

#### **7. 封装（Encapsulation）**

**7.1 封装原则**
• 将数据（成员变量）和行为（成员函数）捆绑为一个单元
• 对外隐藏实现细节，仅暴露必要接口

**示例：温度控制器**
```cpp
class TemperatureController {
private:
    double currentTemp;
    double targetTemp;

    void checkSafety() {  // 内部方法
        if (currentTemp > 100.0) emergencyShutdown();
    }

public:
    void setTarget(double temp) {
        targetTemp = temp;
        adjustHeating();  // 自动触发调整
    }

    double getCurrent() const {  // const成员函数
        return currentTemp; 
    }
};
```

**关键点**：
• `currentTemp`对外完全隐藏
• `const`成员函数保证不修改对象状态
• 修改`targetTemp`会自动触发相关操作

> 声明为const的函数如果修改了成员变量编译器会报错，算是一种自我约束，比如在上面的 `getCurrent()`上面如果写一个 `currentTemp = 1;`这种就会报错

---

#### **8. 继承（Inheritance）**

**8.1 基础继承**

```cpp
class Shape {  // 基类
protected:
    int x, y;
public:
    void move(int dx, int dy) {
        x += dx; 
        y += dy;
    }
    virtual void draw() const = 0;  // 纯虚函数
};

class Circle : public Shape {  // 派生类
private:
    int radius;
public:
    void draw() const override {  // 实现纯虚函数
        std::cout << "Drawing circle at (" << x << "," << y 
                  << ") with radius " << radius << "\n";
    }
};
```

> 对于有纯虚函数的类，我们称之为抽象类，抽象类不能被实例化，只能由子类继承后，子类来实现这个纯虚函数，然后子类可以被示例化

**继承类型对比**：

| 继承方式  | 基类public成员 | 基类protected成员 |
| --------- | -------------- | ----------------- |
| public    | 保持public     | 保持protected     |
| protected | 变为protected  | 保持protected     |
| private   | 变为private    | 变为private       |

**8.2 多重继承（慎用）**
```cpp
class Printer {
public:
    void print(const std::string& text) { /*...*/ }
};

class Scanner {
public:
    void scan() { /*...*/ }
};

class MultifunctionMachine : public Printer, public Scanner {
    // 可以同时调用print()和scan()
};
```

---

#### **9. 多态（Polymorphism）**

**9.1 虚函数机制**
```cpp
class Animal {
public:
    virtual void speak() const {  // 虚函数
        std::cout << "Animal sound\n";
    }
};

class Dog : public Animal {
public:
    void speak() const override {  // 重写
        std::cout << "Woof!\n";
    }
};

void makeSound(const Animal& a) {
    a.speak();  // 动态绑定
}

// 使用
Dog d;
makeSound(d);  // 输出"Woof!"
```

**9.2 抽象类**
```cpp
class DatabaseConnector {  // 抽象类
public:
    virtual void connect() = 0;  // 纯虚函数
    virtual void query(const std::string& sql) = 0;
};

class MySQLConnector : public DatabaseConnector {
public:
    void connect() override { /* MySQL连接实现 */ }
    void query(const std::string& sql) override { /*...*/ }
};
```

**9.3 动态类型识别**
```cpp
Shape* shape = new Circle();
if (auto* c = dynamic_cast<Circle*>(shape)) {  // 安全向下转型
    c->setRadius(10);
}
```

---

#### **10. 运算符重载**

我们可以通过重载运算符来实现我们类的运算，比如实现一个classA+classB的效果

**10.1 基本重载**

```cpp
class Vector2D {
public:
    float x, y;

    // 成员函数形式重载+
    Vector2D operator+(const Vector2D& other) const {
        return {x + other.x, y + other.y};
    }

    // 友元函数形式重载<<
    friend std::ostream& operator<<(std::ostream& os, const Vector2D& v) {
        return os << "(" << v.x << ", " << v.y << ")";
    }
};

// 使用
Vector2D v1{1,2}, v2{3,4};
auto v3 = v1 + v2;  // 调用operator+
std::cout << v3;    // 输出(4, 6)
```

**10.2 特殊运算符**
```cpp
class SmartArray {
public:
    // 下标运算符重载
    int& operator[](size_t index) {
        if (index >= size) throw std::out_of_range("...");
        return data[index];
    }

    // 函数调用运算符（仿函数）
    void operator()(const std::string& msg) {
        std::cout << "Log: " << msg << "\n";
    }
};
```

```c++
// 上面的例子如下
SmartArray sa;
sa(); // 这里就是调用这个仿函数的重载
std::cout<<sa[0]; //这里就是调用下标运算符的重载
```



### **第四部分（进阶）：高级特性与内存管理**

---

#### **11. 内存管理**

**11.1 智能指针（示例代码）**

```cpp
#include <memory>

class Resource {
public:
    Resource() { std::cout << "Resource acquired\n"; }
    ~Resource() { std::cout << "Resource released\n"; }
    void work() { std::cout << "Resource in use\n"; }
};

void smartPointerDemo() {
    // 1. unique_ptr（独占所有权）
    std::unique_ptr<Resource> uPtr(new Resource());
    uPtr->work();  // 正常使用
    // uPtr会自动释放内存

    // 2. shared_ptr（共享所有权）
    std::shared_ptr<Resource> sPtr1 = std::make_shared<Resource>();
    {
        auto sPtr2 = sPtr1;  // 引用计数+1
        sPtr2->work();       // 输出：Resource in use
    } // sPtr2析构，引用计数-1
    // sPtr1仍持有对象

    // 3. weak_ptr（避免循环引用）
    std::weak_ptr<Resource> wPtr = sPtr1;
    if (auto tempPtr = wPtr.lock()) {  // 尝试提升为shared_ptr
        tempPtr->work();  // 只有对象存在时才执行
    }
} // 所有智能指针在此自动管理释放
```
**关键注释**：
• `unique_ptr`：禁止拷贝构造，通过`std::move`转移所有权
• `shared_ptr`：内部维护引用计数，计数归零时销毁对象
• `weak_ptr`：不增加引用计数，解决循环引用问题

---

#### **12. 移动语义**

**12.1 右值引用与移动构造（示例代码）**
```cpp
class DynamicArray {
private:
    int* data;
    size_t size;
public:
    // 常规构造函数
    explicit DynamicArray(size_t sz) : size(sz) {
        data = new int[size];
        std::cout << "Constructed array of size " << size << "\n";
    }

    // 移动构造函数（窃取资源）
    DynamicArray(DynamicArray&& other) noexcept 
        : data(other.data), size(other.size) {  // 1. 窃取指针
        other.data = nullptr;  // 2. 置空原指针
        other.size = 0;
        std::cout << "Move constructor called\n";
    }

    // 移动赋值运算符
    DynamicArray& operator=(DynamicArray&& other) noexcept {
        if (this != &other) {
            delete[] data;      // 释放现有资源
            data = other.data;  // 窃取资源
            size = other.size;
            other.data = nullptr;
            other.size = 0;
            std::cout << "Move assignment called\n";
        }
        return *this;
    }

    ~DynamicArray() {
        delete[] data;  // 安全删除（nullptr可被delete）
        std::cout << "Destroyed array\n";
    }
};

void moveSemanticsDemo() {
    DynamicArray arr1(100);             // 常规构造
    DynamicArray arr2 = std::move(arr1); // 触发移动构造
    DynamicArray arr3(50);
    arr3 = std::move(arr2);             // 触发移动赋值
}
```
**关键注释**：
• `noexcept`：声明函数不抛出异常，优化容器操作
• `std::move`：将左值转换为右值引用，触发移动语义
• 移动后对象必须处于有效但不确定的状态（可析构）

---

#### **13. 设计模式实现**

**13.1 单例模式（线程安全版）**
```cpp
class Logger {
private:
    static std::mutex mtx;          // 静态互斥锁
    static Logger* instance;        // 唯一实例指针
    
    Logger() {}                     // 私有构造函数
    Logger(const Logger&) = delete; // 禁止拷贝
    void operator=(const Logger&) = delete; // 禁止赋值

public:
    static Logger& getInstance() {
        std::lock_guard<std::mutex> lock(mtx);  // 加锁
        if (!instance) {
            instance = new Logger();
        }
        return *instance;
    }

    void log(const std::string& msg) {
        std::cout << "[LOG] " << msg << "\n";
    }
};

// 静态成员初始化
Logger* Logger::instance = nullptr;
std::mutex Logger::mtx;

// 使用示例
void useLogger() {
    Logger::getInstance().log("System started");
}
```
**关键注释**：
• 双重检查锁定模式（DCLP）确保线程安全
• `delete`关键字显式禁用拷贝功能
• 全局通过`getInstance()`访问唯一实例

---

#### **14. Lambda表达式**

**14.1 完整Lambda语法（示例代码）**
```cpp
void lambdaDemo() {
    int base = 10;

    // 1. 完整形式Lambda
    auto func1 = [base](int x) mutable -> int { 
        base += x;  // mutable允许修改捕获的副本
        return base * 2; 
    };

    // 2. 按引用捕获
    auto func2 = [&base](int x) {
        base += x;  // 直接修改外部变量
        return base;
    };

    // 3. 在STL算法中使用
    std::vector<int> nums {1, 2, 3};
    std::for_each(nums.begin(), nums.end(), [](int n) {
        std::cout << n * n << " ";  // 输出：1 4 9
    });
}
```
**关键注释**：
• `[]`：捕获列表（`=`值捕获，`&`引用捕获）
• `mutable`：允许修改值捕获的变量（不影响外部变量）
• `-> return_type`：显式指定返回类型（通常可省略）

### **第五部分：项目实战**

示例：

[jeanhua/JHMG-engine: 四川大学大一下学期C++大作业项目，自己写的2d游戏引擎](https://github.com/jeanhua/JHMG-engine)

[jeanhua/catch_money_byCpp: 求钱之路c++重制版](https://github.com/jeanhua/catch_money_byCpp)
