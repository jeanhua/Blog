---
title: 从简单的机器人到AI Agent
date: 2026-03-15 22:36:34
tags:
- ai
- agent
- QQ机器人
categories:
- ["方法论"]
typora-root-url: ./..
---



## 实现的功能

上文提到我写了一个新的QQ机器人框架，也实现了很多功能，比如

**简单对话**

![AI1](/image/从简单的机器人到AIAgent/AI1.png)

**二次元壁纸**

![acg](/image/从简单的机器人到AIAgent/acg.png)

**不懂**

![waifu](/image/从简单的机器人到AIAgent/waifu.png)

**一些实用工具**

![douyin](/image/从简单的机器人到AIAgent/douyin.png)

**或者是一些好玩的功能**

![gr](/image/从简单的机器人到AIAgent/gr.png)

![newsletter](/image/从简单的机器人到AIAgent/newsletter.png)

**但是这些感觉都太生硬，在AI时代，能不能赋予AI更强的功能**

于是我给内置的AI插件添加了**Function Call**功能，让AI可以发表情包

![AI3](/image/从简单的机器人到AIAgent/AI3.png)

---

## MCP

现在Bot可以在群里或者私聊很有趣的聊天了，但是似乎还差点感觉，于是乎，我觉得再添加更多的能力

一种常见的方法是，继续添加一堆Function Call，但是这个玩意是和Bot代码耦合的，有一点改动就要改动整个Bot，另外我们每个工具都要自己从0开始写，这不符合我设计这个机器人框架的逻辑

于是，我们引入一个AI的一个好东西：**MCP**

参考：[What is the Model Context Protocol (MCP)? - Model Context Protocol](https://modelcontextprotocol.io/docs/getting-started/intro)

将工具脱离了出来，于是乎，我可以接入社区的MCP服务器

**操作Github**

![create_issue](/image/从简单的机器人到AIAgent/create_issue.png)

**操作集市**

![zanao1](/image/从简单的机器人到AIAgent/zanao1.png)

---

## 遇到的问题1

上面的问题看起来是解决了，我们的想法似乎都可以做的很好，但是敏锐的我发现，随便问一个问题，AI反应都要比之前慢很多，这必然是MCP让的Tool过多导致的，随便一个问题，塞进去一堆Tool

慢只是一个方面，token爆炸才是关键

![usage](/image/从简单的机器人到AIAgent/usage.png)

随便问几个问题就花了几百万的token了，还好DeepSeek便宜，要是换个模型几十块钱就没了

那么这个问题也是必须解决的好吧，查了很多资料，最终决定了一个方案

## 渐进式披露

先将MCP分组，然后把分类暴露给AI，当AI决定需要哪个MCP的时候，使用discover去发现这个MCP的工具集，然后看到了有哪些工具，接着AI使用load去加载某个工具的定义信息，就可以使用这个工具了。

通过这个方案，我们的token消耗数大大减少，同时AI的幻觉也得以缓解

---

## 遇到的问题2

### 部分指令AI执行的效果不行

比如让AI去集市发个评论，总是喜欢发一些很像AI的话，想要效果好点还要仔细给她讲清楚，不然还擅自决定，那么怎么一句话让AI听懂指令，出色的完成任务呢

![comment1](/image/从简单的机器人到AIAgent/comment1.png)

我想的是让她先生成一个评论，语言风格要像人，同时问我的意见，我满意了再评论

现在倒好，直接biu发过去了一个AI评论

要解决这个问题，我又要向AI前沿的Anthropic学习了

## Agent Skill

我们引入了一个Agent Skill

```markdown
---
name: campus-market-comment
description: Used for posting comments on the Sichuan University (SCU) Campus Market forum. Use this skill when the user wants to engage with a specific thread.
---

# campus-market-comment

## Persona
You are a student at **Sichuan University (SCU)**. Your goal is to blend in perfectly with other students on the internal campus forum. You must avoid sounding like an AI—no formal politeness, no robotic structures, and no overly helpful "assistant" tone.

## Workflow

### Step 1: Contextual Review
Before drafting, **analyze the existing comments** in the target thread. Identify the current "vibe" (e.g., complaining about exams, sharing food spots, sarcasm, or genuine curiosity) and the specific linguistic style used by the students.

### Step 2: Draft & Review
Generate a draft comment based on the thread's atmosphere and present it to the user for feedback.

**Requirements:**
- **Colloquialism:** Use natural, spoken-style language. Use campus-specific references or common student abbreviations where appropriate.
- **Emotional Expression:** Be expressive. It is okay to be excited, annoyed, or skeptical, but **strictly avoid profanity**.
- **Human-centric:** Do not use "As an AI," "I'm happy to help," or any sycophantic language. Sound like a peer, not a service.

### Step 3: Execution
Once the user approves the draft:
- **Anonymous Posting:** By default, post **anonymously** unless the user explicitly requests otherwise.
- **Strict Adherence:** Post the exact content agreed upon. **Do not add or remove any text** or add AI-related signatures.
- **Reporting:** Inform the user immediately whether the post was successful or if an error occurred.
```

现在AI就可以准确遵守我们的指令了

![comment2](/image/从简单的机器人到AIAgent/comment2.png)

## 参考

[jeanhua/AniaBot: 一个插件驱动型 QQ 机器人框架，内置AI Agent插件，支持MCP和Agent Skill](https://github.com/jeanhua/AniaBot)

[jeanhua/ZanaoMCP: 赞哦校园集市MCP Server，可提供OpenClaw、Claude Desktop等的集市交互](https://github.com/jeanhua/ZanaoMCP)