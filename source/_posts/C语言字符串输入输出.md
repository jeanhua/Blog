---
title: C语言字符串输入输出
date: 2025-04-19 10:38:19
tags:
- 编程笔记
- C语言
categories:
- [编程笔记,C语言]
---

> C语言字符串的输入输出是一个值得探讨的东西

**简单的字符串输入输出**

```c
char str[20];
scanf("%s", str);
printf("%s", str);
```

```bash
hello_world! # 输入
hello_world! # 输出
```

这里我们发现在`scanf`时我们并没有使用取地址符`&`，因为`scanf`的函数实现是往一段内存写入数据，`str`是数组名，在编译时会转换为数组的首地址，等价于下面的写法：

```c
char str[20];
scanf("%s", &str[0]);
printf("%s", str);
```

```bash
hello_world! # 输入
hello_world! # 输出
```

---

在上述的实验中，我们输入一段字符后按下回车键后即可看到输出结果，那么scanf是怎么判断输入的结束呢？

我们再来换一种输入试一下：

```bash
hello world! # 输入
hello        # 输出
```

我们发现输出在hello完成就截止了，说明scanf是以空格(或回车)进行截止的，那假如我们要读取一整段字符串，该如何操作呢？

方法一：

```c
char str[20];
fgets(str, 19, stdin); // 第一个参数是数组，第二个参数是最大读入字符数，第三个是输入的流
printf("%s", str);
```

方法二：

```c
char str[20];
int len = 0;
int c; // 为什么是int不是char型，因为getchar()返回的就是int型
while ((c = getchar()) != '\n' && len < 19) { // (c = getchar())最外面要有括号，否则按照优先级，判断优先，则变成c = (getchar() != '\n')，最终的结果就是c一直是1(true)，或者0(false)
	str[len++] = c;
}
str[len] = '\0';
printf("%s", str);
```

至于为什么是str的下标范围是0~19，为什么这里写小于19？因为我们要保留一个地方放`'\0'`，下面通过`printf`将讲清楚这个东西

先看示例：

```c
int a = 1;
char b = 'b';
char c[] = "c_str";
char* d = c;
char f[3] = { 115,115 ,0};
printf("%d\n%c\n%s\n%s\n%s",a,b,c,d,f);
```

```bash
# 输出：
1
b
c_str
c_str
ss
```

可以看到，`printf`是按照所给的格式输出的，但是当我们写出下面的代码时将会报错：

```c
char f[3] = { 115,115 ,10};
printf("%s",f);
```

为什么，因为输出字符串，`printf`无法判断什么时候结束，因为没用结束标志`'\0'`

上面的`char c[] = "c_str";`也没写`'\0'`，为什么又可以呢？`scanf`输入没写`'\0'`，为什么可以呢？

因为`char c[] = "c_str";`这里编译器给你补了一个`'\0'`，scanf也在输入完成后补了一个`'\0'`

```c
char str[3] = "wd"; //这样写可以
char str[3] = "wd2";//这样就不行，要给编译器留下一个位置放 '\0'
```

示例：

```c
char str[] = "wd";
int len = sizeof(str) / sizeof(char);
printf("%s   %d", str,len);
```

输出：

```bash
wd   3  # 可以看到编译器留了一个位置
```

假如我们这样写，会怎么样？

```c
char str[] = "不是\0哥们！";
printf("%s", str);
```

猜对了，输出：

```bash
不是
```

> visual studio一般不会乱码，vscode上面中文乱码的可以查看这篇 [C语言中文乱码解决方案-vscode - jeanhua's blog](https://www.blog.jeanhua.cn/2024/12/09/d0787b82528e/)

附：C语言格式化控制符表

| 格式控制符                      | 说明                                                         |
| ------------------------------- | ------------------------------------------------------------ |
| %c                              | 输出一个单一的字符                                           |
| %hd、%d、%ld                    | 以十进制、有符号的形式输出 short、int、long 类型的整数       |
| %hu、%u、%lu                    | 以十进制、无符号的形式输出 short、int、long 类型的整数       |
| %ho、%o、%lo                    | 以八进制、不带前缀、无符号的形式输出 short、int、long 类型的整数 |
| %#ho、%#o、%#lo                 | 以八进制、带前缀、无符号的形式输出 short、int、long 类型的整数 |
| %hx、%x、%lx %hX、%X、%lX       | 以十六进制、不带前缀、无符号的形式输出 short、int、long 类型的整数。如果 x 小写，那么输出的十六进制数字也小写；如果 X 大写，那么输出的十六进制数字也大写。 |
| %#hx、%#x、%#lx %#hX、%#X、%#lX | 以十六进制、带前缀、无符号的形式输出 short、int、long 类型的整数。如果 x 小写，那么输出的十六进制数字和前缀都小写；如果 X 大写，那么输出的十六进制数字和前缀都大写。 |
| %f、%lf                         | 以十进制的形式输出 float、double 类型的小数                  |
| %e、%le %E、%lE                 | 以指数的形式输出 float、double 类型的小数。如果 e 小写，那么输出结果中的 e 也小写；如果 E 大写，那么输出结果中的 E 也大写。 |
| %g、%lg %G、%lG                 | 以十进制和指数中较短的形式输出 float、double 类型的小数，并且小数部分的最后不会添加多余的 0。如果 g 小写，那么当以指数形式输出时 e 也小写；如果 G 大写，那么当以指数形式输出时 E 也大写。 |
| %s                              | 输出一个字符串                                               |
