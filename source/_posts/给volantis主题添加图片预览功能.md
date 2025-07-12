---
title: 给volantis主题添加图片预览功能
date: 2025-07-12 17:41:38
tags:
- volantis
- hexo
- 方法论
categories:
- 方法论
typora-root-url: ./..
---

## 给hexo volantis主题添加图片预览功能

本博客使用的就是volantis主题，在最近发现，有些图片的字很小，需要放大查看，但是原来的主题没有图片预览功能，只能连同界面一起放大，体验不好，于是打算手动给主题添加图片预览功能。

> 声明：本方法对主题无污染，配置简单

方法很简单：

在博客目录下，`source`目录下创建一个`js`文件夹，然后在`blogroot/source/js`下创建一个js文件`image_preview.js`

**里面写入如下代码**：

```javascript
if (document.getElementById("vst000001") == null) {
    let stylesheet = document.createElement("link")
    stylesheet.rel = "stylesheet"
    stylesheet.id = "vst000001"
    stylesheet.href = "https://cdn.bootcdn.net/ajax/libs/viewerjs/1.10.0/viewer.min.css"
    document.head.appendChild(stylesheet)

}
if (document.getElementById("vsc000001") == null) {
    let script = document.createElement("script")
    script.id = "vsc000001"
    script.src = "https://cdn.bootcdn.net/ajax/libs/viewerjs/1.10.0/viewer.min.js"
    script.onload = () => {
        new Viewer(document.getElementById('post-body'), {
            button: true,
            inline: false,
            zoomable: true,
            title: false,
            tooltip: false,
            toolbar: false,
            movable: true,
            interval: 1000,
            navbar: false,
            loading: true,
        });
    }
    document.head.appendChild(script)
} else {
    new Viewer(document.getElementById('post-body'), {
        button: true,
        inline: false,
        zoomable: true,
        title: false,
        tooltip: false,
        toolbar: false,
        movable: true,
        interval: 1000,
        navbar: false,
        loading: true,
    });
}
```

**然后再主题配置文件夹下面随便找个地方注入script，比如在版权声明那里插入一个script**

![1](/image/image_preview/1.png)

**即可大功告成**
