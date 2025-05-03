---
title: 【专栏】2.Go指针、结构体与接口
date: 2025-04-23 14:11:32
tags:
- 编程教程
- go
categories:
- [编程笔记,golang]
---

## **1. Go的“轻量级面向对象”**

Go没有传统的类和继承，而是通过**结构体（struct）**和**接口（interface）**实现面向对象的效果。

## **2. 指针**

### **基本用法**

```go
var num int = 42
var p *int = &num  // p指向num的地址
fmt.Println(*p)    // 解引用输出42

*p = 100           // 通过指针修改值
fmt.Println(num)   // 输出100
```

**注意**：

- **安全限制**：Go指针不支持算术运算（如`p++`），避免C语言的内存错误。
- **用途**：函数传参避免拷贝大结构体、修改外部变量。

### **与C指针的对比**

|    特性    |       Go指针        |       C指针        |
| :--------: | :-----------------: | :----------------: |
|  算术运算  |      ❌ 不支持       |       ✔️ 支持       |
| 空指针安全 | 运行时检查（panic） | 段错误（Segfault） |
|   默认值   |        `nil`        |       未定义       |

## **3. 结构体（struct）：**

### **定义与初始化**

```go
type Person struct {
    Name string
    Age  int
    skills []string
}

// 初始化方式
p1 := Person{"Alice", 25, []string{"Go", "Python"}} // 顺序依赖
p2 := Person{Name: "Bob", Age: 30}                  // 字段名指定（推荐）
p3 := new(Person)                                   // 返回指针，字段为零值
```

### **方法接收者**

> go语言没有类，没用类函数，但是可以通过给函数添加一个方法接受者，让其达到类似于类函数的效果，语法如下：
>
> `func (结构体) 函数名(参数)`

示例：

```go
// 值接收者（副本操作）
func (p Person) SayHello() {
    fmt.Printf("Hi, I'm %s\n", p.Name)
}

// 指针接收者（可修改原结构体）
func (p *Person) AddSkill(skill string) {
    p.skills = append(p.skills, skill)
}

// 如果不需要结构体的信息，也可写成匿名接收者
func (Person) SayHello() {
    fmt.Println("Hello")
}

// 调用
p := Person{Name: "jeanhua"}
p.SayHello()       // 值类型调用
p.AddSkill("C#") // 自动转换为指针调用
```

**注意**：

- 需要修改原结构体时用**指针接收者**。
- 大结构体或高频调用优先用指针（减少拷贝开销）。

## **4. 接口（interface）**

### **隐式实现**

```go
type Speaker interface {
	Speak() string
}

type Dog struct{}

func (d Dog) Speak() string { // Dog隐式实现Speaker
	return "Woof!"
}

func greet(s Speaker) {
	fmt.Println(s.Speak())
}

func main() {
	greet(Dog{}) // 输出"Woof!"
	var dog Speaker = Dog{} // 只要Dog实现了Speaker接口，即可让Dog型结构体赋值给Speaker型
	fmt.Println(dog.Speak())
}
```

**注意**：

- **无需`implements`关键字**：只要方法匹配即视为实现接口。
- **接口变量存储`(值, 类型)`对**：可动态持有任意实现者。

> go的接口实现只需要实现该结构体**作为方法接收者**来实现**某接口的所有同名函数**，实现接口后可将该结构体赋值给接口

### **空接口与类型断言**

```go
var any interface{} = "hello" // 空接口可接收任意类型

// 类型断言
if s, ok := any.(string); ok {
    fmt.Println(s) // 输出"hello"
}

// 类型开关（Type Switch）
switch v := any.(type) {
case int:
    fmt.Println("int:", v)
case string:
    fmt.Println("string:", v) // 执行此行
default:
    fmt.Println("unknown")
}
```

## **5. 实战：文件系统接口设计**

**需求**：实现一个通用文件存储接口

**​代码实现​**​：

```go
type FileStorage interface {
    Read(path string) ([]byte, error)
    Write(path string, data []byte) error
}

// 本地存储实现
type LocalStorage struct{}

func (ls LocalStorage) Read(path string) ([]byte, error) {
    return os.ReadFile(path)
}

func (ls LocalStorage) Write(path string, data []byte) error {
    return os.WriteFile(path, data, 0644)
}

// 使用示例
func SaveConfig(storage FileStorage, path string, data []byte) error {
    return storage.Write(path, data)
}
```

## **6. 更多**

### **结构体标签（Struct Tags）**

> 结构体字段后面可以添加标签，通过反射可以获取标签内容

```go
type User struct {
    Name string `json:"name" db:"user_name"` // 元信息标注
}
// 常用于JSON序列化、ORM映射等
```

### **接口零值**

```go
var s Speaker // 接口零值为nil
if s == nil {
    fmt.Println("未赋值") // 会输出
}
```
