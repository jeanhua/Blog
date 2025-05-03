---
title: 【专栏】1.Go语言入门
date: 2025-04-22 13:24:41
tags:
- golang
- 教程
categories:
- [编程笔记,golang]
---

###  **程序结构：从Hello World开始**

```go
package main  // 声明主包（必须）

import "fmt"  // 导入标准库

func main() { // 程序入口
    fmt.Println("Hello, 世界！") 
}
```

- `package main`：可执行程序的入口包。
- `import`：可多行或分组导入（如`import ("fmt"; "math")`）。
- **缩进**：Go强制用Tab或统一空格（推荐用`gofmt`自动格式化）。

### **变量声明**

```go
var name string = "Alice" // 显式类型
var age = 30              // 类型推断
height := 175             // 短声明（函数内使用）
```

**注意**：短声明（`:=`）不能在函数外使用，未使用的变量会编译报错！

### **常量与iota**

```go
const (
    StatusOK = 200
    PI       = 3.14
)

const (
    Monday = iota + 1 // 从1开始枚举
    Tuesday // 2
    Wednesday // 3
)
```

**自动枚举**

```go
const (
		Monday    = iota + 1 // 从1开始枚举
		pass      = "插入"     // “插入”
		Wednesday = iota     // 2
	)

	fmt.Printf("%d %v %v", Monday, pass, Wednesday)
```

输出：

```bash
1 插入 2
```

## **数据类型**

|   类型   |         示例          |  零值   |
| :------: | :-------------------: | :-----: |
|   整型   |    `int`, `uint8`     |   `0`   |
|  浮点型  |       `float64`       |  `0.0`  |
|  布尔型  |        `bool`         | `false` |
|  字符串  |       `string`        |  `""`   |
| 复合类型 | `数组`, `切片`, `map` |  `nil`  |

示例：

```go
var (
    isActive bool               // false
    scores   [3]int             // [0, 0, 0]
    names    []string           // nil切片
    user     map[string]string  // nil map
)
```

**注意数组和切片的区别，数组声明要固定长度，切片不能写长度**

区别：数组长度不可变，切片可动态拓展

```go
var scores = [...]int{1,2,3,4} // 这种是数组（编译器自动确定长度）
var scores = []int{1,2,3,4}    // 这种是切片
```

## **控制结构**

### **if-else：条件可前置**

```go
if score := 85; score >= 90 {
    fmt.Println("A")
} else if score > 60 {
    fmt.Println("B") // 输出B
}
```

### **for循环：唯一的关键字**

```go
for i := 0; i < 3; i++ { // 经典三段式
    fmt.Println(i)
}

sum := 0
for sum < 10 { // 类似while
    sum += 2
}
```

### **switch：默认不穿透**

```go
day := "Wed"
switch day {
case "Mon", "Tue":
    fmt.Println("工作日")
case "Wed":
    fmt.Println("中间日") // 输出此行
default:
    fmt.Println("其他")
}
```

如果需要满足条件往后执行，需要`fallthrough`关键字

如下：

```go
day := "Wed"
switch day {
    case "Mon", "Tue":
    fmt.Println("工作日")
    case "Wed":
    fmt.Println("中间日") // 输出此行
    fallthrough
    default:
    fmt.Println("其他") // 接着输出此行
}
```

输出：

```bash
中间日
其他
```



## **函数：可以多返回值**

```go
func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, fmt.Errorf("除数不能为0")
    }
    return a / b, nil
}

result, err := divide(10, 2) // 调用时处理错误
```

**特殊用法**：

- **命名返回值**：`func sum() (total int) { total = 1+2; return }`

- defer：延迟执行（常用于资源清理）：

  ```go
  func readFile() {
      file, _ := os.Open("test.txt")
      defer file.Close() // 函数返回前执行这条，关闭文件，语法糖，防止后面忘记写
      // 处理文件...
  }
  ```
