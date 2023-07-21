---
layout: Post  # 必须
title: 谓词下推  # 博客标题（必须）
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

## 定义

谓词下推（Predicate Push Down）是一种查询优化技术，用于在执行查询时将谓词（即查询条件）下推到数据源（如关系型数据库）中，在数据被读取前尽可能的过滤掉无关的数据，从而提高查询性能。

谓词：在 SQL 中，谓词（Predicate）即条件表达式，就是返回 boolean 值的函数，或是隐式转换为 boolean 的函数。

下推：至于为什么是下推，单纯是因为数据存储层是作为底层了，通过 SQL 查询数据时，从数据文件中读取数据到内存加工到最后展现，整个过程是自下而上而上的过程。

## Flink SQL 中的谓词下推

Flink SQL 中









