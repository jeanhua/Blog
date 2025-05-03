---
title: 浅谈C语言的scanf
date: 2024-11-02 20:43:11
tags:
- C语言
categories:
- 随笔
---

### 前言

> 最近看到小登的作业，计算输入的数学表达式，只包含加减乘除，不考虑优先级，感觉的好像要用到字符串分割，但是作为新生的作业，应该不会涉及这么难的过程。

<!-- more -->

**投机取巧？**

如下：

```c
#include<stdio.h>
int main() {
	float num,result;
	char tag;
	scanf("%f", &result);
	while (true)
	{
		tag = getchar();
		if (tag == '\n') {
			break;
		}
		else
		{
			scanf("%f", &num);
			switch (tag)
			{
			case '+':
				result += num;
				break;
			case '-':
				result -= num;
				break;
			case '*':
				result *= num;
				break;
			case '/':
				result /= num;
			}
		}
	}
	printf("%f", result);
}
```

这里就用到scanf的特性了，**格式化输入**，scanf会自动匹配读入的字符，比如上文的%f就会自动匹配浮点类型的(整数类型会隐式转换为浮点型)，然后用getchar把运算符读入，读到换行符终止，即可完成

![](/image/浅谈C语言/1.png)
