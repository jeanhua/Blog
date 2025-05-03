---
title: 【专栏】4.Go基础库
date: 2025-04-25 12:56:36
tags:
- 编程教程
- go
categories:
- [编程笔记,golang]
---

Go基础库的使用

<!--more-->

#### 1. 文件操作：`os`与`io`

**使用场景**：读写文件、目录遍历、权限控制

```go
// 读取文件全部内容（推荐小文件）
data, err := os.ReadFile("test.txt")
if err != nil {
    log.Fatal(err)
}

// 流式处理大文件（内存友好）
file, err := os.Open("large.log")
defer file.Close()
scanner := bufio.NewScanner(file)
for scanner.Scan() {
    fmt.Println(scanner.Text())
}

// 写文件（带权限控制）
err = os.WriteFile("output.txt", []byte("Hello"), 0644)
```

**关键点**：

- 使用`defer`确保文件描述符关闭
- `os.FileMode`控制Unix风格权限（如0755）

#### 2. JSON处理：`encoding/json`

**结构化数据编解码**：

```go
type User struct {
    Name string `json:"name"`  // 字段标签控制映射
    Age  int    `json:"age,omitempty"`
}

// 序列化
user := User{Name: "Alice"}
jsonData, _ := json.Marshal(user)  // {"name":"Alice"}

// 反序列化（注意使用指针传递）
var u User
json.Unmarshal([]byte(`{"name":"Bob"}`), &u)
```

**高级技巧**：

- `json.RawMessage`延迟解析部分JSON
- 自定义`MarshalJSON()`方法实现特殊序列化逻辑
- 使用`json.Encoder`/`Decoder`处理流式JSON

> go语言json序列化是通过反射获取结构体标签进行序列化

#### 3. HTTP服务：`net/http`

**快速启动Web服务器**：

```go
// 处理函数
func helloHandler(w http.ResponseWriter, r *http.Request) {
    if r.Method != "GET" {
        w.WriteHeader(http.StatusMethodNotAllowed)
        return
    }
    fmt.Fprintf(w, "Hello %s", r.URL.Query().Get("name"))
}

// 路由注册
http.HandleFunc("/hello", helloHandler)

// 启动服务
log.Fatal(http.ListenAndServe(":8080", nil))
```

**关键组件**：

- `http.Request`：解析查询参数、Headers、Body
- `http.ResponseWriter`：设置状态码、写入响应
- `http.Client`：实现超时控制、连接池等客户端功能

```go
client := &http.Client{
    Timeout: 5 * time.Second,
}
resp, err := client.Get("https://api.example.com")
```

#### 4. 时间处理：`time`包

**时间点与时间段操作**：

```go
// 获取当前时间
now := time.Now()
fmt.Println(now.Format("2006-01-02 15:04:05")) // 这里的时间必须这么写，go就是这么抽象（）

// 解析字符串时间
t, _ := time.Parse(time.RFC3339, "2023-08-20T12:00:00Z")

// 计算时间差
duration := time.Since(t)
fmt.Printf("已过去 %.0f 分钟", duration.Minutes())

// 定时器与Ticker
timer := time.NewTimer(2 * time.Second)
<-timer.C // 阻塞直到触发
```

**注意事项**：

- 时区处理务必显式指定`time.Location`
- 高精度计时用`time.Now().UnixNano()`
- 周期性任务推荐`time.Ticker`而非简单`Sleep`
