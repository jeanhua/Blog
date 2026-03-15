---
title: 设计一个QQ机器人框架
date: 2026-03-15 21:58:44
tags:
- QQ机器人
- 机器人框架
- golang
categories:
- ["方法论"]
typora-root-url: ./..
---

> 记得去年心血来潮，写了一个QQ机器人，整了好多功能，但是因为刚学习，设计方向没太注意，越来越混乱，到后面想加一些功能都加不进去了，于是全部推倒重来

## 基本层次

QQ机器人大题要经过如下步骤：

接收消息 → 处理消息 → 回复消息

之前是直接顺着写的，写了一个napcat接收消息，然后调用函数处理，接着再发请求给napcat回复消息

![消息交互](/image/设计一个QQ机器人框架/消息交互1.png)

这样顺着来的，但是后面发现一个问题，当我要修改网络接口的时候，比如要换一个端口，或者把http换成websocket的时候要维护两套交互

另外，由于接收请求后直接调用处理的函数，耦合过强，每次加点功能都要侵入核心的代码，久而久之，越来越混乱

**那么如何解决？**

我把框架大题分成这样几个层次：

- 协议交互层：只负责和上游协议交互，比如napcat的http和websocket协议
- 核心层：负责协调和处理转发协议交互层的消息，以及处理一些核心功能
- 插件层：负责处理消息事件和自定义逻辑

![处理逻辑](/image/设计一个QQ机器人框架/处理逻辑.png)

这样就把消息交互和处理逻辑解耦和了

## 基础支持

### 功能性支持

除了这些基础的功能之外，我还在原来的基础上补充了：

- 定时任务
- 消息持久化（通过持久化适配器，内部自带redis实现，可替换）
- 配置管理（使用viper）

### 代码支持

在代码部分我做了大量的设计，反复推敲，设计了一套极简的方法：

**运行Bot:**

```go
package main

import (
    "github.com/jeanhua/AniaBot/bot/core"
    "github.com/jeanhua/AniaBot/bot/adapter/napcat"
    "github.com/jeanhua/AniaBot/bot/plugins/pluginaichat"
    "github.com/jeanhua/AniaBot/bot/plugins/pluginlog"
)

func main() {
    // 创建协议适配器
    adapter := napcat.NewNapcatWebSocketAdapter()
    
    // 创建机器人实例
    bot := core.NewAniaBot(adapter)
    
    // 注册插件
    bot.AddPlugin(pluginlog.NewPlugin())          // 日志插件
    bot.AddPlugin(pluginaichat.NewAIChatPlugin()) // AI对话插件
    
    // 启动机器人
    bot.Run()
}
```

通过内置插件，只需几行代码即可运行

---

**插件创建：**

```go
type YourPlugin struct {
    plugin.Meta
}
```

只需要嵌入一个插件元结构体，即可完成一个新插件

然后写一个注册函数：

```go
package plugincustom

func NewPlugin() *YourPlugin {
    return &YourPlugin{
        Meta: plugin.Meta{
            Name:      "插件名称",
            HelpWords: "插件描述",
            AdminOnly: false, // 当该字段为true时非管理员发送/help(PluginSys插件)不会显示插件信息
            ShowFor:   plugininfo.ShowForGroup | plugininfo.ShowForFriend, // 插件显示范围
            Author:    "作者名称", // 插件作者
            Version:   "1.0.0",    // 插件版本号
            Order:     0, // 插件执行顺序，从小到大
        },
    }
}
```

然后在主函数里面注册：

`bot.AddPlugin(plugincustom.NewPlugin())`

即可注册入系统

---

**处理逻辑**

在插件嵌入插件元结构体之后就实现了插件所有的接口，所以想要实现某个功能，只需重写这个方法

比如重写接收群聊消息事件方法：

```go
func (p *HelloPlugin) OnGroupMsg(ctx context.Context, bot bot.Bot, cmd command.Command, msg message.Message) (bool, error) {
    if cmd.Name == "hello" {
        builder := msgchain.Builder().Group()
        builder.Text("你好！我是 AniaBot，很高兴为你服务！")
        bot.SendGroupMsg(msg.GroupId, builder.Build())
        return false, nil // 阻止后续插件执行
    }
    return true, nil // 继续执行后续插件
}
```

核心思想是，重写想要的函数，实现对应的功能

---

**消息构造器：从“拼字符串”到“对象化构建”**

在早期的 `PinBot` 中，发送一条带图片和 `@` 人的消息通常需要手动拼接复杂的 CQ 码或 JSON 字符串，代码极其难看且容易出错： `" [CQ:at,qq=123] " + "你好" + "[CQ:image,file=xxx]"`

在 `AniaBot` 中，我设计了一套标准化的 **消息链（Message Chain）** 构建方案。

1. 链式调用（Fluent API）

通过 `msgchain.Builder()`，我们可以像搭积木一样组合消息。这种设计不仅代码优雅，而且配合 IDE 的补全功能，开发者几乎不需要查文档就能上手。

Go

```
// 构造一条复杂的群聊回复
builder := msgchain.Builder().Group()

builder.At(msg.Sender.UserId).        // @发送者
        Text(" 你的任务已完成！\n").      // 文本内容
        Face(124).                    // QQ表情
        Image("https://exam.com/a.png") // 网络图片

// 发送构建好的消息链
bot.SendGroupMsg(msg.GroupId, builder.Build())
```

2. 自动适配与类型安全

消息构造器内部将每种元素抽象为 `MessageNode`。这样做有三个核心优势：

- **协议无关性**：无论底层是 NapCat 的 HTTP 还是 WebSocket，甚至是未来接入其他平台，`Builder` 产出的标准节点都会被适配器（Adapter）自动转换。
- **多媒体支持**：统一了本地路径、网络 URL 和 Base64 编码的图片/语音处理逻辑。
- **上下文感知**：通过 `Group()` 或 `Private()` 方法，Builder 会自动校验当前消息链是否符合该场景的约束。

---

最终的结果是：

![框架](/image/设计一个QQ机器人框架/framework.png)

## 参考

第一个机器人：[jeanhua/PinBot: 【已废弃，完全重构为AniaBot】基于Napcat的QQ机器人](https://github.com/jeanhua/PinBot)

新版机器人框架：[jeanhua/AniaBot: 一个插件驱动型 QQ 机器人框架，内置AI Agent插件，支持MCP和Agent Skill](https://github.com/jeanhua/AniaBot)
