---
layout: Post  # 必须
title: Streaming 102 - The world beyond batch  # 博客标题（必须）
subtitle: 无界数据处理的 What, Where, When, How（方便回顾，自己做了个翻译）  # 博客副标题（可选）
date: 2022-09-01  # 博客日期，会显示在文章头部（可选）
useHeaderImage: true  # 是否在博客中显示封面图：`image`（显示） / `text`（不显示）（可选，默认为 `text`）
headerImage: /img/blog_cover/2022/09/streaming-102-cover.png   # 博客封面图（必须，即使上一项选了 `text`，图片也需要在首页显示）
headerMask: rgba(40, 57, 101, .4)  # 封面图遮罩（可选）
catalog: true  # 是否启用右侧目录：false / true（可选，默认为 false）
permalinkPattern: /post/:year/:month/:slug/
tags:  # 博客标签
- 大数据
- streaming
---

> Author: Tyler Akidau
>
> 原文连接: https://www.oreilly.com/radar/the-world-beyond-batch-streaming-102/
>
> Editor's Note: 这是关于数据处理演变两个系列中的第二部分，着重关注流式系统、无界数据集、以及大数据的未来

## 1. 介绍

欢迎回来，如果你错过了我之前的帖子 —— [The World beyond batch: Streaming 101]()，我强烈建议您花时间先阅读该内容。它为我将在这篇文章中介绍的主题奠定了必要的基础，并且我假设您已经熟悉那里介绍的术语和概念。~~Caveat lector and all that.~~

另外，需要注意的是，这篇文章包含许多动画，所以那些试图打印它的人会错过一些最好的部分。~~Caveat printor and all that.~~

简单回顾一下，上次我着重于三个主要领域：==术语(terminology)==，当我使用类似"streaming"等重载术语时，精确定义我(想表达)的意思；==批与流的比较(batch versus streaming)==，比较这两种系统的理论能力，并假设只有两件事才能使流式系统超越批处理系统

