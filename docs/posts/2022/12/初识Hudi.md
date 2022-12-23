---
layout: Post  # 必须
title: 简单了解一下Hudi  # 博客标题（必须）
subtitle:  # 博客副标题（可选）
date: 2022-12-21  # 博客日期，会显示在文章头部（可选）
useHeaderImage: true  # 是否在博客中显示封面图：`image`（显示） / `text`（不显示）（可选，默认为 `text`）
headerImage: /img/blog_cover/2022/12/hudi_first.png   # 博客封面图（必须，即使上一项选了 `text`，图片也需要在首页显示）
headerMask: rgba(40, 57, 101, .4)  # 封面图遮罩（可选）
catalog: true  # 是否启用右侧目录：false / true（可选，默认为 false）
permalinkPattern: /post/:year/:month/:slug/
tags:  # 博客标签
- 大数据
- hudi
---

## 定位

官方将Hudi定位为**流式数据湖**平台，提供了直连数据湖的核心数仓和数据库的功能。

在其使用上，不同于传统的数据库，它并没有需要安装的服务，它仅仅只是一个Jar包，或可称为一个SDK包。

这一点上，与Iceberg一样，或许Hudi也可以跟Iceberg一样，将其称为一种 **Table Format**

## 特性

- 支持流式工作负载
- 支持增量批处理管道，支持增量查询
- 记录级的变更流

- 支持事务、回滚
- 并发控制
- 支持 Schema 演进和约束
- 支持索引
- 支持Upsert、Delete
- 自动文件大小管理、合并、清理
- 支持 Flink、Spark、Hive 等引擎的 SQL 读写
- 支持构建 CDC 采集

## 整体设计

##### 存储

可以基于各厂商的云存储、HDFS进行数据和元数据的存储

##### File Format

程序内部以 Avro 作为数据结构，落地默认存储使用 Parquet，支持 Parquet、HFile、ORC

##### 事务型的数据库内核

支持并发控制、表服务、索引、湖缓存、Table Format、Timeline

##### SQL 层面 API

支持 Spark DataFrame、RDD

支持 Flink SQL、DataStream API

##### 生态

支持 Presto、Hive、Spark、Flink

## 应用场景

- 近实时数据摄取

  Hudi支持插入、更新和删除数据的能力。您可以实时摄取消息队列（Kafka）和日志服务SLS等日志数据至Hudi中，同时也支持实时同步数据库Binlog产生的变更数据。

  Hudi优化了数据写入过程中产生的小文件。因此，相比其他传统的文件格式，Hudi对HDFS文件系统更加的友好。

- 近实时数据分析

  Hudi支持多种数据分析引擎，包括Hive、Spark、Presto和Impala。Hudi作为一种文件格式，不需要依赖额外的服务进程，在使用上也更加的轻量化。

- 增量数据处理

  Hudi支持Incremental Query查询类型，您可以通过Spark Streaming查询给定COMMIT后发生变更的数据。Hudi提供了一种消费HDFS变化数据的能力，可以用来优化现有的系统架构。