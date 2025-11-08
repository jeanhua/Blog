---
title: springboot学习
date: 2025-08-11 16:45:43
tags:
- SpringBoot
- java
categories:
- 学习笔记
---

## 前言

暑假和室友做了一个商业项目，基本目标是做一个小程序，用户完成问卷后根据结果推荐对应的产品，要点有问卷管理，用户管理，商品管理……

我决定使用java的`springboot`框架来编写，尽管我之前只学习了`C# Asp.Net`框架，好在这两个框架的思想差不多，很快就可以上手了

## 遇到的坑

spring几乎是一个全能的后端框架，很多地方做了封装，使用注解和依赖注入的方式，自动管理各种组件对象的生命周期，但是也有很多隐含的坑

### 1.springboot JPA懒加载存Redis出现问题

从性能方面考虑，在数据库实体中存在外键，比如多对一的关系时，加载“一”的时候，如果不访问“多”的一方，那“多”的一方便不会加载，只是以一个代理对象的形式存在，所以，当把这个数据存进Redis的时候就出问题了，解决方案有很多，经典的一种是使用DTO，把代理对象访问了然后存进一个非懒加载的数组中，然后把这个DTO存进数据库即可

### 2.springboot 外键多对一JSON序列化死循环问题

在多对一的关系中，由于在双方中都有对方的引用，让访问的时候很方便，但是当JSON序列化的时候，就会导致循环嵌套导致死循环溢出，解决方案也很简单，给成员加一对注解即可`@JsonManagedReference`和`@JsonBackReference`，或者更简单点，加个`@JsonIgnore`也行

### 3.springboot+swagger的使用，注解添加信息

由于之前学习的ASP.NET框架自带的swagger，调试API很方便，也可以导出到postman或者apifox这些工具里面调试，故在这里记录一下。

在SpringBoot里面使用swagger也很简单

在pom.xml添加

```xml
<dependency>
	<groupId>org.springdoc</groupId>
	<artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
</dependency>
```

即可，maven会自动安装依赖

然后在配置文件里面填写

```properties
springdoc.api-docs.enabled=true
debug=true
```

即可，但是注意正式发布前要去掉

### 4.restTemplate发送请求手机号登陆问题

在接入微信手机号登陆的时候出现问题，使用RestTemplate发送请求始终失败，网上找了说什么无法获取content-length，都建议装第三方的http库来请求，但是为了这一个接口装一个第三方库有点鸡肋了，后面经过研究，可以这样：

```java
url = "https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token="+ Objects.requireNonNull(result.getBody()).access_token;
var requestBody = "{\"code\":\"value\"}".replace("value",loginRequestDTO.code); // 换成字符串传进去就可以
var phoneBack = restTemplate.postForEntity(url,new HttpEntity<>(requestBody,new HttpHeaders()),PhoneRequestResponse.class);
```

这种就可以了，难绷

### 5.库存数据一致性问题(乐观锁悲观锁，冲突重试)

> 库存一致性指的是**数据库中记录的库存数量与实际业务中的库存数量始终保持一致**，避免出现“超卖”（库存为负）或“少卖”（库存未扣减）的情况。

乐观锁是先修改后检查，冲突就报错，适用于并发不高的小系统

悲观锁是先上锁后操作数据，适应于中等并发的系统

显而易见，我们这个小系统使用的悲观锁就可以

但是不能冲突了就报错，人家买个东西报错了也不好，所以要加一个错误重试机制，这里Spring框架早有准备，也有这个重试机制，加个依赖和注解就行

```xml
<dependency>
	<groupId>org.springframework.retry</groupId>
	<artifactId>spring-retry</artifactId>
</dependency>
```

在函数前添加注解

```java
@Retryable(retryFor = ObjectOptimisticLockingFailureException.class, maxAttempts = 3, backoff = @Backoff(delay = 2000L, multiplier = 1.5))
```

> 这里插个题外话，如果是超高并发的系统，设计的其实更是复杂，有一种思路是使用redis配合lua脚本预扣库存，然后使用消息队列异步减少数据库库存

### 6.订单超时问题

创建订单的时候有一个时间戳，使用一个时钟任务定时检查，关闭超时的订单即可，这里Spring框架也准备好了（），直接添加注解即可

入口类主函数添加`@EnableScheduling`，然后写一个`service`，函数前添加注解即可

```java
@Scheduled(initialDelay = 5000, fixedDelay = 1000 * 60 * 30) // 30min执行1次
```

### 7.定时调用API获取物流信息

同上，加个函数即可

### 8.Transactional事务

> Spring Boot 的 @Transactional 就是一个“声明式事务”开关，贴在方法或类上，Spring 会自动帮你：
>
> 1. 开始时开启事务；
> 2. 出现异常时回滚；
> 3. 正常结束时提交。
>
> 一句话：
> **加了这个注解，就能把多条数据库操作当成一个整体，要么一起成功，要么一起撤销。**

使用事务有必要性：比如在创建订单的时候，库存减成功了，但是订单创建失败了，如果不使用事务，就会导致货不对数。

### 9.物流费用设计

涉及到购买商品就有物流的问题，这里我们想了一个解决方案，用三级处理，省，市，区，逐级匹配，优先全匹配，比如先查找是否设置了四川省成都市双流区的邮费，没有就找四川省成都市，再没有就四川省，最后就回退到默认的邮费

### 10.transactional在同一个类中失效问题

很多注解都会有这个问题，比如重试注解，当在类内部时无法作用，这是因为：

> **@Transactional 是靠 Spring AOP 代理实现的，类内部自己调自己的方法绕过了代理，导致事务切面没生效**

这里要注意，容易出问题

### 11.支付问题

这就是微信sdk的问题了，文档写的一坨，自己的官方示例都不用自己的sdk，真的抽象，不过基础问题已经解决，最后封装成了一个service，可以在代码目录里面查看
