---
layout: Post  # 必须
title: LSM-Tree  # 博客标题（必须）
subtitle:  # 博客副标题（可选）
date: 2023-11-03  # 博客日期，会显示在文章头部（可选）
useHeaderImage: true  # 是否在博客中显示封面图：`image`（显示） / `text`（不显示）（可选，默认为 `text`）
headerImage: /img/blog_cover/2023/11/LSM-Tree-cover.png   # 博客封面图（必须，即使上一项选了 `text`，图片也需要在首页显示）
headerMask: rgba(40, 57, 101, .4)  # 封面图遮罩（可选）
catalog: true  # 是否启用右侧目录：false / true（可选，默认为 false）
permalinkPattern: /post/:year/:month/:slug/
tags:  # 博客标签
- 数据结构
---

LSM-Tree，全称为==日志结构合并树（Log Structured Merge Tree）==

它并非是一种特定的数据结构，而是一种文件组织方式的统称，更多的是一种思想，其核心是：利用磁盘顺序写入性能远大于随机写入性能的特性，以牺牲少许读的性能，实现更高的写入性能

::: tip Tips

起源于 Google 发表的 [《Bigtable: A Distributed Storage System for Structured Data》](https://static.googleusercontent.com/media/research.google.com/en//archive/bigtable-osdi06.pdf) 论文中所使用的文件组织方式

:::

现在的许多产品将 LSM-Tree 作为其主要的文件组织策略， 例如：Hbase、Cassandra、LevelDB、SQLite、MongoDB 3.0

