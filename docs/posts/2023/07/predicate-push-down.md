---
layout: Post  # 必须
title: 《谓词下推》  # 博客标题（必须）
subtitle:  # 博客副标题（可选）
date: 2023-07-19  # 博客日期，会显示在文章头部（可选）
useHeaderImage: true  # 是否在博客中显示封面图：`image`（显示） / `text`（不显示）（可选，默认为 `text`）
headerImage: /img/blog_cover/2023/07/impala_refresh_metadata.jpg   # 博客封面图（必须，即使上一项选了 `text`，图片也需要在首页显示）
headerMask: rgba(40, 57, 101, .4)  # 封面图遮罩（可选）
catalog: true  # 是否启用右侧目录：false / true（可选，默认为 false）
permalinkPattern: /post/:year/:month/:slug/
tags:  # 博客标签
- 大数据
- SQL 优化
- 谓词下推
---

在研究 Flink SQL 优化时，涉及到一个术语——《谓词下推》。虽然知道谓词下推大概是个什么概念，但是脑袋里蹦出了一个问题，明明是由上游先进行过滤后，在推给下游，为什么被称为下推？抱着这个问题，也就顺便完整了解了一下什么是谓词下推。

::: tip Tips

此处提到“上游”、“下游”是针对 SQL 执行计划而言

:::

## 

