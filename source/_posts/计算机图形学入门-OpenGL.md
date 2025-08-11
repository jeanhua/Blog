---
title: 计算机图形学入门 -- OpenGL
date: 2025-08-11 20:28:00
tags:
- 计算机图形学
- OpenGL
categories:
- 学习笔记
typora-root-url: ./..
---

> 暑假闲的没事干，学习了一下计算机图形学，入门了OpenGL，记录一下

## 什么是OpenGL

OpenGL（**Open Graphics Library**）是一个跨平台、跨语言的**图形应用程序接口（API）**，用于渲染**2D、3D矢量图形**。它由**Khronos Group**维护，广泛应用于**游戏开发、CAD设计、虚拟现实、科学可视化**等领域。

## 使用C++编写创建一个窗口

### 1.需要安装两个库

`GLFW`和`Glad`库，**GLFW 负责把窗口和输入搞定，GLAD 负责把 OpenGL 的函数指针加载好**。

如果使用`vcpkg`，可以很方便的安装

```bash
vcpkg install glfw3 glad
```

然后导入头文件

```cpp
#include<glad/glad.h>
#include<GLFW/glfw3.h>
```

### 2.代码编写

2.1 初始化

```cpp
glfwInit();
glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 4);
glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 6);
glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);
```

> `GLFW_OPENGL_CORE_PROFILE`说明这里使用核心渲染模式，不使用过去的立即渲染模式

2.2 窗口创建

```cpp
GLFWwindow* window = glfwCreateWindow(800, 600, "study", nullptr, nullptr);
if (window == nullptr) {
	std::cout << "error when create window" << std::endl;
	return -1;
}
// 绑定上下文（绑定到当前线程）
glfwMakeContextCurrent(window);
// 绑定窗口变化监听的函数
glfwSetFramebufferSizeCallback(window,framebufferSizeCallback);
// 绑定按键监听函数
glfwSetKeyCallback(window, keybordCallBack);
```

回调函数定义如下：

```cpp
void framebufferSizeCallback(GLFWwindow* window, int width, int height) {
	glViewport(0, 0, width, height);
}
```

```cpp
void keybordCallBack(GLFWwindow* window, int key, int scancode, int action, int mods) {
	if (key == GLFW_KEY_ESCAPE && action == 1 && mods == 0) { // ESC键按下退出
		glfwSetWindowShouldClose(window, true);
	}
}
```

2.3 加载OpenGL

```cpp
if (!gladLoadGLLoader((GLADloadproc)glfwGetProcAddress)) {
	std::cout << "error when load glad loader" << std::endl;
	return -1;
}
```

2.4 窗口准备

```cpp
glViewport(0, 0, 800, 600); // 渲染的区域范围
glClearColor(0.2f, 0.3f, 0.3f, 1.0f); // 设置刷新颜色
```

2.5 窗口循环

```cpp
while (!glfwWindowShouldClose(window)) {
	glfwPollEvents(); // 处理各类事件
	glClear(GL_COLOR_BUFFER_BIT); // 清空窗口
	glfwSwapBuffers(window); // 这里类似于刷新缓冲区，减少画面卡顿
}
glfwTerminate(); // 结束
std::cout << "exit" << std::endl;
return 0;
```

即可完成窗口的创建

![window](./image/计算机图形学入门/empty_window.png)

## 在窗口中渲染一个三角形

### 1.基础概念

> 在OpenGL中，任何事物都在3D空间中，而屏幕和窗口却是2D像素数组，这导致OpenGL的大部分工作都是关于把3D坐标转变为适应你屏幕的2D像素。3D坐标转为2D坐标的处理过程是由OpenGL的图形渲染管线（Graphics Pipeline，大多译为管线，实际上指的是一堆原始图形数据途经一个输送管道，期间经过各种变化处理最终出现在屏幕的过程）管理的。图形渲染管线可以被划分为两个主要部分：第一部分把你的3D坐标转换为2D坐标，第二部分是把2D坐标转变为实际的有颜色的像素。

![pipeline](/image/计算机图形学入门/pipeline.png)

1. **图形渲染管线（Graphics Pipeline）**
   把 3D 坐标 → 2D 像素的一条“传送带”，分两大阶段：①坐标变换 ②像素着色，可并行、可替换其中的 Shader。
2. **标准化设备坐标（NDC）**
   所有顶点最终必须落到 **[-1, 1]³** 的立方体里，否则被裁掉；y 向上，原点在中心。
3. **图元（Primitive）**
   告诉 OpenGL 把顶点当成什么来装配：点 `GL_POINTS`、线 `GL_LINE_STRIP`、三角形 `GL_TRIANGLES`……
4. **顶点属性（Vertex Attribute）**
   每个顶点可以携带任意数据，最简形式是 `vec3 position`。
5. **VBO（Vertex Buffer Object）**
   GPU 显存里的“一卡车”顶点数据，一次性从 CPU 上传，减少 draw call 开销。
6. **顶点着色器（Vertex Shader）**
   逐顶点执行，把本地坐标 → 裁剪坐标，输出 `gl_Position`（必须写）。
7. **片段着色器（Fragment Shader）**
   逐像素执行，决定最终颜色；输出 `vec4 FragColor`（必须写）。
8. **着色器程序（Shader Program）**
   把若干编译好的 Shader（至少顶点+片段）链接成可执行程序，绘制前 `glUseProgram(id)` 激活。
9. **glVertexAttribPointer / glEnableVertexAttribArray**
   告诉 OpenGL 如何从 VBO 里解析出顶点属性（位置、颜色、法线…）。
10. **VAO（Vertex Array Object）**
    把“VBO + 解析规则 + EBO”打包成一个对象；绑定一次 VAO = 一键恢复全部状态，Core Profile 强制使用。
11. **EBO / IBO（Element/Index Buffer Object）**
    存索引，避免重复顶点；配合 `glDrawElements` 做索引绘制，省内存。
12. **绘制调用**
    - 无索引：`glDrawArrays(GL_TRIANGLES, 0, 3)`
    - 有索引：`glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, 0)`

### 2.代码编写

2.1 创建mesh数据

```cpp
// 准备一个vao，位置信息和颜色信息分开
void prepareSingleBuffer() {
	float positions[] = {
		-0.5f,0.0f,0.0f,
		0.5f,0.0f,0.0f,
		0.0f,0.5f,0.0f
	};
	float colors[] = {
		1.0f,0.0f,0.0f,
		0.0f,1.0f,0.0f,
		0.0f,0.0f,1.0f
	};

	GLuint posVbo = 0, colorVbo = 0;
	glGenBuffers(1, &posVbo);
	glGenBuffers(1, &colorVbo);

	glBindBuffer(GL_ARRAY_BUFFER, posVbo);
	glBufferData(GL_ARRAY_BUFFER, sizeof(positions), positions, GL_STATIC_DRAW);
	glBindBuffer(GL_ARRAY_BUFFER, colorVbo);
	glBufferData(GL_ARRAY_BUFFER, sizeof(colors), colors, GL_STATIC_DRAW);

	glGenVertexArrays(1, &vao);
	glBindVertexArray(vao);

	glBindBuffer(GL_ARRAY_BUFFER, posVbo);
	glEnableVertexAttribArray(0);
	glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, sizeof(float) * 3, (void*)0);

	glBindBuffer(GL_ARRAY_BUFFER, colorVbo);
	glEnableVertexAttribArray(1);
	glVertexAttribPointer(1, 3, GL_FLOAT, GL_FALSE, sizeof(float) * 3, (void*)0);

	glBindVertexArray(0);
}

// 当然也可以这么写
void prepareInterleavedBuffer() {
	float vertex[] = {
		-0.5f,0.5f,0.0f,1.0f,0.0f,0.0f,
		0.5f,-0.5f,0.0f,0.0f,1.0f,0.0f,
		0.0f,0.5f,0.0f,0.0f,0.0f,1.0f
	};

	GLuint vbo = 0;
	glGenBuffers(1, &vbo);
	glBindBuffer(GL_ARRAY_BUFFER, vbo);
	glBufferData(GL_ARRAY_BUFFER, sizeof(vertex), vertex, GL_STATIC_DRAW);

	glGenVertexArrays(1, &vao);
	glBindVertexArray(vao);
	glEnableVertexAttribArray(0);
	glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, sizeof(float) * 6, (void*)0);
	glVertexAttribPointer(1, 3, GL_FLOAT, GL_FALSE, sizeof(float) * 6, (void*)(3*sizeof(float)));

	glBindVertexArray(0);
}
```

> VBO是记录顶点的元数据，比如位置，颜色，uv之类的
>
> VAO是记录VBO的结构，定义了如何使用VBO的数据
>
> 通过 VBO → VAO → Shader 这个过程，即可渲染出一个物体

2.2 创建着色器

```cpp
void createShaderProgram() {

	/*
	*	顶点着色器
	*/
	const char* vertexShaderSource = "#version 330 core\n"
		"layout (location = 0) in vec3 aPos;\n"
		"layout (location = 1) in vec3 aColor;\n"
		"out vec3 vertexColor;\n"
		"void main()\n"
		"{\n"
		"   gl_Position = vec4(aPos.x, aPos.y, aPos.z, 1.0);\n"
		"   vertexColor = aColor;\n"
		"}\0";
	// 创建shader
	unsigned int vertexShader;
	vertexShader = glCreateShader(GL_VERTEX_SHADER);
	// 添加代码
	glShaderSource(vertexShader, 1, &vertexShaderSource, NULL);
	// 编译shader
	glCompileShader(vertexShader);
	// 检查编译结果
	int  success;
	char infoLog[512];
	glGetShaderiv(vertexShader, GL_COMPILE_STATUS, &success);
	if (!success)
	{
		glGetShaderInfoLog(vertexShader, 512, NULL, infoLog);
		std::cout << "ERROR::SHADER::VERTEX::COMPILATION_FAILED\n" << infoLog << std::endl;
		exit(0);
	}

	/*
	*	片段着色器
	*/
	const char* fragmentShaderSource = R"(
		#version 330 core
		in vec3 vertexColor;
		out vec4 FragColor;

		void main()
		{
			FragColor = vec4(vertexColor, 1.0f);
		} 
			)";

	unsigned int fragmentShader;
	fragmentShader = glCreateShader(GL_FRAGMENT_SHADER);
	glShaderSource(fragmentShader, 1, &fragmentShaderSource, NULL);
	glCompileShader(fragmentShader);
	glGetShaderiv(fragmentShader, GL_COMPILE_STATUS, &success);
	if (!success)
	{
		glGetShaderInfoLog(fragmentShader, 512, NULL, infoLog);
		std::cout << "ERROR::SHADER::FRAGMENT::COMPILATION_FAILED\n" << infoLog << std::endl;
		exit(0);
	}

	// 创建着色器容器
	shaderProgram = glCreateProgram();
	// 附着着色器
	glAttachShader(shaderProgram, vertexShader);
	glAttachShader(shaderProgram, fragmentShader);
	// 链接着色器
	glLinkProgram(shaderProgram);
	glGetProgramiv(shaderProgram, GL_LINK_STATUS, &success);
	if (!success) {
		glGetProgramInfoLog(shaderProgram, 512, NULL, infoLog);
		std::cout << "ERROR::SHADER::FRAGMENT::LINK_FAILED\n" << infoLog << std::endl;
		exit(0);
	}
	// 使用着色器
	glUseProgram(shaderProgram);
	// 完成销毁
	glDeleteShader(vertexShader);
	glDeleteShader(fragmentShader);
}
```

2.3 渲染

完成上面的步骤后，在渲染循环中编写如下代码

```
glfwPollEvents();
glClear(GL_COLOR_BUFFER_BIT);

glUseProgram(shaderProgram);
glBindVertexArray(vao);
glDrawArrays(GL_TRIANGLES, 0,3);

glfwSwapBuffers(window);
```

成功渲染出一个三角形：

![rectangle](/image/计算机图形学入门/rectangle.png)

## 完整实例

main.cpp

```cpp
#include "OpenGLStudy.h"

int main() 
{
	glfwInit();
	glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 4);
	glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 6);
	glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);

	GLFWwindow* window = glfwCreateWindow(800, 600, "study", nullptr, nullptr);
	if (window == nullptr) {
		std::cout << "error when create window" << std::endl;
		return 1;
	}
	glfwMakeContextCurrent(window);

	glfwSetFramebufferSizeCallback(window,framebufferSizeCallback);

	glfwSetKeyCallback(window, keybordCallBack);

	if (!gladLoadGLLoader((GLADloadproc)glfwGetProcAddress)) {
		std::cout << "error when load glad loader" << std::endl;
		return -1;
	}

	glViewport(0, 0, 800, 600);
	glClearColor(0.2f, 0.3f, 0.3f, 1.0f);

	//prepareInterleavedBuffer();
	prepareSingleBuffer();
	createShaderProgram();

	while (!glfwWindowShouldClose(window)) {
		render(window);
	}
	glfwTerminate();
	std::cout << "exit" << std::endl;
	return 0;
}
```

OpenGLStudy.h:

```cpp
#pragma once
#include<iostream>
#include<glad/glad.h>
#include<GLFW/glfw3.h>

GLuint vao, shaderProgram;


// 窗口大小改变回调函数(缓冲区大小)
void framebufferSizeCallback(GLFWwindow* window, int width, int height) {
	glViewport(0, 0, width, height);
}

// 键盘事件回调函数
void keybordCallBack(GLFWwindow* window, int key, int scancode, int action, int mods) {
	if (key == GLFW_KEY_ESCAPE && action == 1 && mods == 0) {
		glfwSetWindowShouldClose(window, true);
	}
}

// 准备一个vao，位置信息和颜色信息分开
void prepareSingleBuffer() {
	float positions[] = {
		-0.5f,0.0f,0.0f,
		0.5f,0.0f,0.0f,
		0.0f,0.5f,0.0f
	};
	float colors[] = {
		1.0f,0.0f,0.0f,
		0.0f,1.0f,0.0f,
		0.0f,0.0f,1.0f
	};

	GLuint posVbo = 0, colorVbo = 0;
	glGenBuffers(1, &posVbo);
	glGenBuffers(1, &colorVbo);

	glBindBuffer(GL_ARRAY_BUFFER, posVbo);
	glBufferData(GL_ARRAY_BUFFER, sizeof(positions), positions, GL_STATIC_DRAW);
	glBindBuffer(GL_ARRAY_BUFFER, colorVbo);
	glBufferData(GL_ARRAY_BUFFER, sizeof(colors), colors, GL_STATIC_DRAW);

	glGenVertexArrays(1, &vao);
	glBindVertexArray(vao);

	glBindBuffer(GL_ARRAY_BUFFER, posVbo);
	glEnableVertexAttribArray(0);
	glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, sizeof(float) * 3, (void*)0);

	glBindBuffer(GL_ARRAY_BUFFER, colorVbo);
	glEnableVertexAttribArray(1);
	glVertexAttribPointer(1, 3, GL_FLOAT, GL_FALSE, sizeof(float) * 3, (void*)0);

	glBindVertexArray(0);

}

void prepareInterleavedBuffer() {
	float vertex[] = {
		-0.5f,0.5f,0.0f,1.0f,0.0f,0.0f,
		0.5f,-0.5f,0.0f,0.0f,1.0f,0.0f,
		0.0f,0.5f,0.0f,0.0f,0.0f,1.0f
	};

	GLuint vbo = 0;
	glGenBuffers(1, &vbo);
	glBindBuffer(GL_ARRAY_BUFFER, vbo);
	glBufferData(GL_ARRAY_BUFFER, sizeof(vertex), vertex, GL_STATIC_DRAW);

	glGenVertexArrays(1, &vao);
	glBindVertexArray(vao);
	glEnableVertexAttribArray(0);
	glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, sizeof(float) * 6, (void*)0);
	glVertexAttribPointer(1, 3, GL_FLOAT, GL_FALSE, sizeof(float) * 6, (void*)(3*sizeof(float)));

	glBindVertexArray(0);
}

void createShaderProgram() {

	/*
	*	顶点着色器
	*/
	const char* vertexShaderSource = "#version 330 core\n"
		"layout (location = 0) in vec3 aPos;\n"
		"layout (location = 1) in vec3 aColor;\n"
		"out vec3 vertexColor;\n"
		"void main()\n"
		"{\n"
		"   gl_Position = vec4(aPos.x, aPos.y, aPos.z, 1.0);\n"
		"   vertexColor = aColor;\n"
		"}\0";
	// 创建shader
	unsigned int vertexShader;
	vertexShader = glCreateShader(GL_VERTEX_SHADER);
	// 添加代码
	glShaderSource(vertexShader, 1, &vertexShaderSource, NULL);
	// 编译shader
	glCompileShader(vertexShader);
	// 检查编译结果
	int  success;
	char infoLog[512];
	glGetShaderiv(vertexShader, GL_COMPILE_STATUS, &success);
	if (!success)
	{
		glGetShaderInfoLog(vertexShader, 512, NULL, infoLog);
		std::cout << "ERROR::SHADER::VERTEX::COMPILATION_FAILED\n" << infoLog << std::endl;
		exit(0);
	}

	/*
	*	片段着色器
	*/
	const char* fragmentShaderSource = R"(
		#version 330 core
		in vec3 vertexColor;
		out vec4 FragColor;

		void main()
		{
			FragColor = vec4(vertexColor, 1.0f);
		} 
			)";

	unsigned int fragmentShader;
	fragmentShader = glCreateShader(GL_FRAGMENT_SHADER);
	glShaderSource(fragmentShader, 1, &fragmentShaderSource, NULL);
	glCompileShader(fragmentShader);
	glGetShaderiv(fragmentShader, GL_COMPILE_STATUS, &success);
	if (!success)
	{
		glGetShaderInfoLog(fragmentShader, 512, NULL, infoLog);
		std::cout << "ERROR::SHADER::FRAGMENT::COMPILATION_FAILED\n" << infoLog << std::endl;
		exit(0);
	}

	// 创建着色器容器
	shaderProgram = glCreateProgram();
	// 附着着色器
	glAttachShader(shaderProgram, vertexShader);
	glAttachShader(shaderProgram, fragmentShader);
	// 链接着色器
	glLinkProgram(shaderProgram);
	glGetProgramiv(shaderProgram, GL_LINK_STATUS, &success);
	if (!success) {
		glGetProgramInfoLog(shaderProgram, 512, NULL, infoLog);
		std::cout << "ERROR::SHADER::FRAGMENT::LINK_FAILED\n" << infoLog << std::endl;
		exit(0);
	}
	// 使用着色器
	glUseProgram(shaderProgram);
	// 完成销毁
	glDeleteShader(vertexShader);
	glDeleteShader(fragmentShader);
}

void render(GLFWwindow* window) {
	glfwPollEvents();
	glClear(GL_COLOR_BUFFER_BIT);
	

	glUseProgram(shaderProgram);
	glBindVertexArray(vao);
	glDrawArrays(GL_TRIANGLES, 0,3);

	glfwSwapBuffers(window);
}
```



## 参考资料

1. [Learn OpenGL, extensive tutorial resource for learning Modern OpenGL](https://learnopengl.com/)

2. [游戏着色器（Shader）基础介绍 - 知乎](https://zhuanlan.zhihu.com/p/599456569)
