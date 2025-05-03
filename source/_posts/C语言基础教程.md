---
title: 【速通】C语言基础教程
date: 2025-04-18 22:14:13
tags:
- 编程教程
- C语言
categories:
- [编程笔记,速通]
---

> 这篇文章是我的第一篇编程教程，也是给自己学的东西的一点总结，由于篇幅和精力，作为一篇普适性的文章，涉及的C语言都是很基础的。

## 1. C语言简介

C语言是一种通用、高级且面向过程的编程语言，由贝尔实验室的丹尼斯・里奇于20世纪70年代开发。它具有高效、灵活的特点，可直接访问硬件，代码执行速度快。C语言语法简洁，拥有丰富的数据类型和运算符，广泛应用于系统软件、嵌入式开发、游戏、驱动程序等领域。C语言还是许多现代编程语言的基础，对计算机科学发展影响深远，是学习编程和理解计算机底层原理的重要工具。

## 2. 基本语法

### 代码结构与注释

C语言的代码结构通常由函数组成。每个C语言程序的执行都从`main()`函数开始（实际上并不是从main开始的，这里只是方便理解，可以自己想一下原因）

代码示例：

```c
#include <stdio.h>  // 预处理指令，导入头文件

int main() {        // 主函数入口
    printf("Hello, World!\n");  // 输出语句
    return 0;       // 返回0，表示程序正常结束
}
```

**注释**：
- 单行注释：`//`后面的内容为注释
- 多行注释：`/*`和`*/`之间的内容为注释

**注释里面的代码只是方便人理解，不会被编译器编译**

### 数据类型与变量

C语言支持多种基本数据类型，其中最常用的是：
- `int`：整数类型，通常用于表示整数值。
- `float`：单精度浮点类型，用于表示小数。
- `double`：双精度浮点类型，表示更高精度的小数。
- `char`：字符类型，通常用于存储单个字符。

**声明变量**：C语言需要在使用变量之前声明它的类型。声明语法如下：

```c
int a;       // 声明一个整数变量
float b;     // 声明一个浮点型变量
char c;      // 声明一个字符型变量
int d = 1;   // 也可以在声明变量时进行初始化（推荐，防止访问未初始化的变量造成程序崩溃）
```

### 常量与宏定义

**常量**：常量是在程序运行期间不能改变的值。在C语言中，可以通过`const`关键字定义常量。

```c
const int maxAge = 100;  // 定义常量maxAge
maxAge = 2; // 错误，const定义的常量不能更改
```

**宏定义**：宏定义使用`#define`预处理指令，可以在程序中定义常量值或宏函数。宏的作用是在编译时进行**简单的文本替换**，不会考虑类型，所以要注意可能会由于类型报错。

```c
#define PI 3.14159  // 定义常量PI
#define SQUARE(x) ((x) * (x))  // 定义宏函数SQUARE
```

完整示例：

```c
#include <stdio.h>
#define MAX_VALUE 100
int main() {
    const int minValue = 0;   // 常量
    printf("Max value: %d, Min value: %d\n", MAX_VALUE, minValue);
    return 0;
}
```

### 基本输入输出（`printf`和`scanf`）

**输出函数printf**：用于向屏幕输出信息。其基本用法如下：

```c
printf("文本内容 %d\n", 变量名);  // %d表示输出整数
```

常用格式说明符：
- `%d`：输出整数
- `%f`：输出浮点数
- `%c`：输出字符
- `%s`：输出字符串

**示例**：

```c
int age = 25;
printf("My age is %d\n", age);  // 输出：My age is 25
```

**输入函数scanf**：用于从键盘输入数据。它会根据指定的格式将输入的值存储到变量中。

```c
scanf("格式字符串", &变量名);  // scanf是向变量地址写入，所以要加&取地址符
```

```c
char str[10];
scanf("%s",str); // 数组可以不用取地址，因为数组名可以退化为数组首地址，等价于&str[0]
```

```c
int num[5];
scanf("%d",&num[5]); // 这里就要取地址，因为num是首地址，但是nun后面有[]代表取到数组元素，这时就要取地址
```

## 3. 运算符与表达式

### 算术运算符

| 运算符 | 描述           | 示例    |
| ------ | -------------- | ------- |
| `+`    | 加法           | `a + b` |
| `-`    | 减法           | `a - b` |
| `*`    | 乘法           | `a * b` |
| `/`    | 除法           | `a / b` |
| `%`    | 取余（模运算） | `a % b` |

示例：

```c
int a = 10, b = 3;
int sum = a + b;      // sum = 13
int diff = a - b;     // diff = 7
int product = a * b;  // product = 30
int quotient = a / b; // quotient = 3
int remainder = a % b; // remainder = 1
```

**注意**：
- `/`运算符在整数除法中会丢弃小数部分。

  那么整数除以整数怎么计算小数部分呢？把其中一个数变成浮点数即可，可以强制转换

  比如

  ```c
  int a = 3,b = 2;
  float c1 = a / b; // c1 = 1.0;
  float c2 = (float)a / b; // c2 = 1.5
  float c2 = a / (float)b; // 或者这种
  int c3 = (float)a / b; // c3 = 1 这种也会丢失小数，因为c3是int型，要注意
  ```

- `%`运算符仅适用于整数类型，返回除法的余数。

### 关系运算符

关系运算符用于比较两个值，返回一个布尔值（`true`或`false`）。它们用于判断条件。

| 运算符 | 描述       | 示例     |
| ------ | ---------- | -------- |
| `==`   | 等于       | `a == b` |
| `!=`   | 不等于     | `a != b` |
| `>`    | 大于       | `a > b`  |
| `<`    | 小于       | `a < b`  |
| `>=`   | 大于或等于 | `a >= b` |
| `<=`   | 小于或等于 | `a <= b` |

**注意，判断等于是两个等号，写一个等号是赋值语句，这种初学时容易犯错**

示例：

```c
int a = 10, b = 3;
if (a > b) {
    printf("a is greater than b\n");  // 输出：a is greater than b
}
```

### 逻辑运算符

逻辑运算符用于对条件进行逻辑运算，返回布尔值。

| 运算符 | 描述   | 示例             |
| ------ | ------ | ---------------- |
| `&&`   | 逻辑与 | `a > b && b > 0` |
| `\|\|`   | 逻辑或 | `a \|\| b`         |
| `!`    | 逻辑非 | `!(a > b)`       |

示例：

```c
int a = 10, b = 3;
if (a > b && b > 0) {
    printf("Both conditions are true\n");  // 输出：Both conditions are true
}
```

### 位运算符

位运算符用于对整数类型的二进制位进行操作。它们常用于底层编程、加密等领域。

| 运算符 | 描述     | 示例     |
| ------ | -------- | -------- |
| `&`    | 按位与   | `a & b`  |
| `\|`    | 按位或   | `a \| b`  |
| `^`    | 按位异或 | `a ^ b`  |
| `~`    | 按位取反 | `~a`     |
| `<<`   | 左移     | `a << 2` |
| `>>`   | 右移     | `a >> 2` |

示例：

```c
int a = 5, b = 3; // 二进制：a = 0101, b = 0011
int and_result = a & b;  // and_result = 1 (0101 & 0011 = 0001)
int or_result = a | b;   // or_result = 7 (0101 | 0011 = 0111)
```

**位移操作**：
- 左移：将二进制数的所有位向左移动，右边补零。
- 右移：将二进制数的所有位向右移动，左边补符号位。

示例：

```c
int a = 5;   // 二进制：0101
int result = a << 1;  // 结果：1010，即10
```

### 条件运算符

条件运算符是一种简化的`if-else`语句。它的基本格式是：

`condition ? expression1 : expression2;`

`condition`为真时取`expression1`的返回值，否则取`expression2`的返回值

示例：

```c
int a = 10, b = 3;
int max = (a > b) ? a : b;  // max = 10，因为a > b
// 翻译为如果a>b，则取a，否则取b
```

```c
int max(int a,int b,int c){
    return (a>b?a:(b>c?b:c)); // 这里通过嵌套实现了三个数取最大值
}
```

> 三元运算符是一个很不错的方式，在未来的学习中会经常用到，比如flutter和react的条件渲染可以通过三元运算符达到一个快速实现

### 运算符优先级与结合性

运算符优先级决定了表达式中各个运算符的计算顺序。优先级高的运算符先计算。

**常见优先级**：
1. `()`, `[]`, `.`, `->`（数组下标、函数调用、结构体成员访问）
2. `*`, `/`, `%`（乘法、除法、取余）
3. `+`, `-`（加法、减法）
4. `==`, `!=`, `>`, `<`, `>=`, `<=`（比较运算符）
5. `&&`, `||`（逻辑与、逻辑或）
6. `=`, `+=`, `-=`, `*=`, `/=`, `%=`（赋值运算符）

**结合性**：
- 大多数运算符是从左到右结合的（例如`+`, `-`, `*`）。
- 赋值运算符(`=`)是从右到左结合的。

示例：

```c
int a = 10, b = 5, c = 3;
int result = a + b * c;  // 先计算b * c，再加上a，即result = 10 + 15 = 25
```

## 4. 控制结构

### 条件语句

条件语句用于根据某个条件的真假来决定是否执行某些代码。在C语言中，常见的条件语句有`if`、`else`和`switch`。

#### `if`语句

`if`语句根据一个条件表达式的结果来决定是否执行某段代码。如果条件为真，执行对应的代码块。

**语法**：

```c
if (condition) {
    // 条件为真时执行的代码
}
```

**示例**：

```c
int a = 10;
if (a > 5) {
    printf("a is greater than 5\n");  // 输出：a is greater than 5
}
```

#### `if-else`语句

`if-else`语句提供了一个可选的代码块，当条件为假时执行`else`后面的代码。

**语法**：

```c
if (condition) {
    // 条件为真时执行的代码
} else {
    // 条件为假时执行的代码
}
```

**示例**：

```c
int a = 3;
if (a > 5) {
    printf("a is greater than 5\n");
} else {
    printf("a is not greater than 5\n");  // 输出：a is not greater than 5
}
```

#### `if-else if-else`语句

当有多个条件时，可以使用`else if`来进行多个条件的判断。

**语法**：

```c
if (condition1) {
    // 条件1为真时执行的代码
} else if (condition2) {
    // 条件2为真时执行的代码
} else {
    // 条件1和条件2都为假时执行的代码
}
```

**示例**：

```c
int a = 7;
if (a > 10) {
    printf("a is greater than 10\n");
} else if (a > 5) {
    printf("a is greater than 5 but less than or equal to 10\n");  // 输出：a is greater than 5 but less than or equal to 10
} else {
    printf("a is less than or equal to 5\n");
}
```

#### `switch`语句

`switch`语句根据变量的值匹配多个可能的选项，并执行对应的代码块。`switch`通常用于值的离散比较，而不适用于范围判断。

**语法**：

```c
switch (expression) {
    case value1:
        // expression == value1时执行的代码
        break;
    case value2:
        // expression == value2时执行的代码
        break;
    default:
        // 如果没有匹配的值，执行这段代码
}
```

**示例**：

```c
int day = 3;
switch (day) {
    case 1:
        printf("Monday\n");
        break;
    case 2:
        printf("Tuesday\n");
        break;
    case 3:
        printf("Wednesday\n");  // 输出：Wednesday
        break;
    default:
        printf("Invalid day\n");
}
```

### 循环语句

循环语句允许你重复执行某段代码，直到满足某个条件为止。常见的循环语句有`for`、`while`和`do-while`。

#### `for`循环

`for`循环是一种最常见的循环结构，通常用于已知循环次数的情况。

**语法**：

```c
for (initialization; condition; increment) {
    // 循环体
}
```

- **initialization**：初始化语句，在循环开始时执行一次。
- **condition**：循环条件，每次循环前判断，如果为真，继续执行；如果为假，退出循环。
- **increment**：每次循环结束后执行，通常用于更新循环变量。

**示例**：

```c
for (int i = 1; i <= 5; i++) {
    printf("i = %d\n", i);  // 输出：i = 1, i = 2, i = 3, i = 4, i = 5
}
```

#### `while`循环

`while`循环是基于条件判断的循环，只要条件为真，就继续执行循环体。

**语法**：

```c
while (condition) {
    // 循环体
}
```

**示例**：

```c
int i = 1;
while (i <= 5) {
    printf("i = %d\n", i);  // 输出：i = 1, i = 2, i = 3, i = 4, i = 5
    i++;
}
```

#### `do-while`循环

`do-while`循环与`while`循环类似，不同之处在于它至少执行一次循环体，然后再判断条件。

**语法**：

```c
do {
    // 循环体
} while (condition);
```

**示例**：

```c
int i = 1;
do {
    printf("i = %d\n", i);  // 输出：i = 1, i = 2, i = 3, i = 4, i = 5
    i++;
} while (i <= 5);
```

### 跳转语句

跳转语句用于改变程序的执行流程。常见的跳转语句有`break`、`continue`和`return`。

#### `break`语句

`break`语句用于跳出当前循环或`switch`语句。它立即终止循环或`switch`，并继续执行循环或`switch`语句后的代码。

**示例**：

```c
for (int i = 1; i <= 10; i++) {
    if (i == 5) {
        break;  // 当i == 5时跳出循环
    }
    printf("i = %d\n", i);  // 输出：i = 1, i = 2, i = 3, i = 4
}
```

#### `continue`语句

`continue`语句用于跳过当前循环的剩余部分，直接进入下一次循环。

**示例**：

```c
for (int i = 1; i <= 5; i++) {
    if (i == 3) {
        continue;  // 当i == 3时跳过当前循环
    }
    printf("i = %d\n", i);  // 输出：i = 1, i = 2, i = 4, i = 5
}
```

#### `return`语句

`return`语句用于终止当前函数的执行，并可以选择性地返回一个值。它通常用于从函数中返回计算结果。

**示例**：

```c
int add(int a, int b) {
    return a + b;  // 返回a和b的和
}

int main() {
    int result = add(5, 3);
    printf("Result: %d\n", result);  // 输出：Result: 8
    return 0;
}
```

## 5. 函数

在C语言中，函数是程序的基本构建块之一。通过函数，我们可以将代码分块，提升程序的模块化、可读性和可维护性。函数可以接收输入（参数），并返回结果（返回值）。在本节中，我们将介绍C语言中函数的定义、声明、参数传递以及一些进阶概念。

### 函数的定义与声明

C语言的函数由函数名、返回类型、参数列表和函数体组成。函数定义的基本语法如下：

**语法**：

```c
return_type function_name(parameter1, parameter2, ...) {
    // 函数体：包含具体的代码逻辑
}
```

- **返回类型（return_type）**：表示函数的返回值类型。如果函数没有返回值，使用`void`。
- **函数名（function_name）**：标识函数的名称。
- **参数列表（parameter1, parameter2, ...）**：函数接收的输入参数，可以是多个，使用逗号分隔。没有参数时，使用空的圆括号`()`。
- **函数体**：包含函数的具体操作代码，通常是由一系列语句构成。

**示例**：

```c
#include <stdio.h>

// 函数声明
int add(int a, int b);

int main() {
    int result = add(3, 5);  // 调用函数
    printf("Sum: %d\n", result);  // 输出：Sum: 8
    return 0;
}

// 函数定义
int add(int a, int b) {
    return a + b;
}
```

### 函数的参数与返回值

函数可以通过参数接收外部数据，也可以通过返回值将计算结果传递给调用者。C语言中的函数参数传递是通过值传递的方式进行的，即传递的是参数值的副本。

#### 参数传递

C语言中，函数参数传递有两种方式：**值传递**和**引用传递**（通过指针）。

- **值传递**：调用函数时，传递给函数的参数是其值的副本，函数对参数的修改不会影响到原始数据。

  **示例**：

  ```c
  void changeValue(int a) {
      a = 10;  // 修改的是a的副本
  }
  
  int main() {
      int num = 5;
      changeValue(num);
      printf("num = %d\n", num);  // 输出：num = 5，原值未改变
      return 0;
  }
  ```

- **引用传递**（通过指针）：可以通过传递变量的地址（指针），在函数内部直接修改原始数据。

  **示例**：

  ```c
  void changeValue(int *a) {
      *a = 10;  // 修改的是a指向的地址内容
  }
  
  int main() {
      int num = 5;
      changeValue(&num);  // 传递num的地址
      printf("num = %d\n", num);  // 输出：num = 10，值被修改
      return 0;
  }
  ```

#### 返回值

一个函数可以返回一个值，表示计算结果。返回值的类型由函数的返回类型决定。如果函数没有返回值，可以使用`void`。

**示例**：

```c
#include <stdio.h>

float multiply(float x, float y) {
    return x * y;  // 返回两个数的乘积
}

int main() {
    float result = multiply(3.5, 2.0);
    printf("Multiplication result: %.2f\n", result);  // 输出：Multiplication result: 7.00
    return 0;
}
```

### 递归函数

递归是函数自己调用自己的一种编程技巧。递归函数通常用于解决可以被分解为相似子问题的问题。递归函数必须有一个**基准条件**，用于终止递归调用。

**示例**：计算阶乘

```c
#include <stdio.h>

// 递归函数：计算n的阶乘
int factorial(int n) {
    if (n == 0) {
        return 1;  // 基准条件：0的阶乘是1
    } else {
        return n * factorial(n - 1);  // 递归调用
    }
}

int main() {
    int result = factorial(5);
    printf("Factorial of 5 is: %d\n", result);  // 输出：Factorial of 5 is: 120
    return 0;
}
```

**递归调用过程**：

```
factorial(5) = 5 * factorial(4)
factorial(4) = 4 * factorial(3)
factorial(3) = 3 * factorial(2)
factorial(2) = 2 * factorial(1)
factorial(1) = 1 * factorial(0)
factorial(0) = 1 (基准条件)
```

### 作用域与生命周期

C语言中的作用域和生命周期决定了变量在程序中的有效范围和存在时间。

- **局部变量**：在函数内部声明的变量，只有在函数执行时有效。它们在函数调用时创建，执行完后销毁。

  **示例**：

  ```c
  void myFunction() {
      int a = 5;  // 局部变量
      printf("a = %d\n", a);  // 输出：a = 5
  }
  
  int main() {
      myFunction();
      // printf("a = %d\n", a);  // 错误：a在main函数中不可访问
      return 0;
  }
  ```

- **全局变量**：在所有函数外部声明的变量，可以在程序的任何地方访问。全局变量在程序启动时创建，在程序结束时销毁。

  **示例**：

  ```c
  int globalVar = 10;  // 全局变量
  
  void printGlobalVar() {
      printf("globalVar = %d\n", globalVar);  // 输出：globalVar = 10
  }
  
  int main() {
      printGlobalVar();
      return 0;
  }
  ```

### 函数指针

函数指针是一个指向函数的指针变量，可以用来动态调用函数。它允许我们将函数作为参数传递给其他函数，或在运行时决定调用哪个函数。

**声明函数指针**：

```c
return_type (*function_ptr)(parameter_types);
```

**示例**：

```c
#include <stdio.h>

int add(int a, int b) {
    return a + b;
}

int subtract(int a, int b) {
    return a - b;
}

int main() {
    int (*operation)(int, int);  // 声明函数指针
    operation = add;  // 将函数指针指向add函数
    printf("Add: %d\n", operation(3, 4));  // 输出：Add: 7
    
    operation = subtract;  // 将函数指针指向subtract函数
    printf("Subtract: %d\n", operation(10, 3));  // 输出：Subtract: 7
    
    return 0;
}
```

## 6. 数组与字符串

### 一维数组与多维数组

**一维数组**：相同类型元素的线性集合

```c
// 声明与初始化
int arr[5] = {1, 2, 3, 4, 5}; 

// 访问元素
printf("%d", arr[2]); // 输出：3
```

**多维数组**（以二维为例）：

```c
int matrix[2][3] = {
    {1, 2, 3},
    {4, 5, 6}
};
printf("%d", matrix[1][2]); // 输出：6
```

### 字符数组与字符串操作

**字符数组**：

```c
char str1[6] = {'H', 'e', 'l', 'l', 'o', '\0'};
char str2[] = "World"; // 自动添加\0
```

**字符串函数**（需包含`string.h`）：

| 函数 | 描述 |
|------|------|
| `strlen()` | 字符串长度 |
| `strcpy()` | 字符串复制 |
| `strcat()` | 字符串连接 |
| `strcmp()` | 字符串比较 |

```c
char s1[20] = "Hello";
char s2[] = " World";
strcat(s1, s2); // s1变为"Hello World"
```

### 数组的指针表示

数组名本质是指向首元素的指针：

```c
int arr[3] = {10, 20, 30};
int *ptr = arr; // 等价于 &arr[0]
printf("%d", *(ptr+1)); // 输出：20
```

## 7. 指针

### 指针基础

**定义与使用**：

```c
int var = 10;
int *p = &var; // p存储var的地址

printf("%d", *p); // 解引用，输出：10
*p = 20; // 通过指针修改变量值
```

### 指针与数组

```c
int arr[3] = {1, 2, 3};
int *p = arr;

// 以下三种写法等价
arr[1] = 5;
*(arr + 1) = 5;
*(p + 1) = 5;
```

### 指针与函数

**指针作为参数**：

```c
void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int x = 1, y = 2;
swap(&x, &y); // x=2, y=1
```

### 动态内存管理

**基本操作**：

```c
#include <stdlib.h>

// 分配内存
int *arr = (int*)malloc(5 * sizeof(int));

// 重新分配
arr = (int*)realloc(arr, 10 * sizeof(int));

// 释放内存
free(arr);
```

**常见错误**：
- 忘记释放内存（内存泄漏）
- 使用已释放的内存
- 越界访问

## 8. 结构体与联合体

### 结构体定义与使用

```c
struct Student {
    char name[20];
    int age;
    float score;
};

// 声明变量
struct Student stu1 = {"Alice", 20, 90.5};

// 访问成员
printf("%s", stu1.name);
```

### 结构体指针与动态分配

```c
struct Student *pStu = (struct Student*)malloc(sizeof(struct Student));
strcpy(pStu->name, "Bob");
pStu->age = 21;

free(pStu);
```

### 联合体的定义与应用

联合体所有成员共享同一内存空间：

```c
union Data {
    int i;
    float f;
    char str[20];
};

union Data data;
data.i = 10; // 此时其他成员的值无意义
```

典型应用：类型转换、节省内存

## 9. 文件操作

### 文件打开与关闭

```c
FILE *fp;

// 打开文件（读写模式）
fp = fopen("test.txt", "r+");
if (fp == NULL) {
    perror("Error opening file");
    return -1;
}

// 关闭文件
fclose(fp);
```

### 文件读写操作

**格式化读写**：

```c
// 写入
fprintf(fp, "%s %d", "Hello", 123);

// 读取
char str[20];
int num;
fscanf(fp, "%s %d", str, &num);
```

**二进制读写**：

```c
struct Student stu;
fwrite(&stu, sizeof(struct Student), 1, fp);
fread(&stu, sizeof(struct Student), 1, fp);
```

### 文件指针与错误处理

```c
// 移动文件指针
fseek(fp, 0, SEEK_SET); // 回到文件开头

// 错误检测
if (ferror(fp)) {
    printf("File error occurred\n");
}
```

## 10. 内存管理

### 栈与堆的区别

| 特性 | 栈 | 堆 |
|------|----|----|
| 分配方式 | 自动分配/释放 | 手动分配/释放 |
| 大小限制 | 较小（MB级） | 较大（受系统限制） |
| 访问速度 | 更快 | 较慢 |
| 碎片问题 | 无 | 可能有 |

### 内存泄漏检测

**常见检测方法**：
1. 使用工具（Valgrind、Dr. Memory）
2. 重载malloc/free函数
3. 维护分配/释放日志

**预防措施**：
```c
// 分配后立即初始化
int *p = malloc(sizeof(int));
if (p != NULL) {
    *p = 0;
}

// 释放后置空
free(p);
p = NULL;
```

### 内存分配技巧

1. **批量分配**优于多次小分配
   ```c
   // 不好
   for (int i=0; i<100; i++) {
       arr[i] = malloc(sizeof(int));
   }
   
   // 更好
   int *block = malloc(100 * sizeof(int));
   ```

2. **对齐分配**提高访问效率
   ```c
   #include <stdalign.h>
   alignas(16) int aligned_arr[100];
   ```

3. **自定义内存池**用于高频操作
   ```c
   void* mem_pool_alloc(size_t size);
   void mem_pool_free(void* ptr);
   ```

完整的内存管理示例：
```c
#include <stdio.h>
#include <stdlib.h>

void safe_malloc_example() {
    int *ptr = NULL;
    
    // 带错误检查的分配
    ptr = (int*)malloc(5 * sizeof(int));
    if (ptr == NULL) {
        fprintf(stderr, "Memory allocation failed\n");
        exit(EXIT_FAILURE);
    }
    
    // 使用内存
    for (int i = 0; i < 5; i++) {
        ptr[i] = i * 10;
    }
    
    // 释放内存
    free(ptr);
    ptr = NULL; // 防止悬空指针
}

int main() {
    safe_malloc_example();
    return 0;
}
```



## 11.项目实战

完成上述的学习之后一定要完成一个项目实战，便于发现自己的缺漏点以及总结知识

示例：

[jeanhua/catch_money: c语言简单小游戏——求钱之路](https://github.com/jeanhua/catch_money)

