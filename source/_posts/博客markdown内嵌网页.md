---
title: 博客markdown内嵌网页
tags: 
- markdown
excerpt: ''
date: 2024-04-27 18:31:00
---

<meta name="referrer" content="never">
在markdown插入以下代码即可

<!-- more -->

```html
<div style="position: relative; padding: 30% 45%;">
    <iframe style="position: absolute; width: 100%; height: 100%; left: 0; top: 0;" src="网页链接" frameborder="1" scrolling="yes" width="320" height="240"></iframe>
</div>
```

### 比如下面的效果

<div style="position: relative; padding: 30% 45%;border:4px solid #090">
    <iframe style="position: absolute; width: 100%; height: 100%; left: 0; top: 0;" src="https://www.res.jeanhua.cn" frameborder="1" scrolling="yes" width="320" height="240"></iframe>
</div>