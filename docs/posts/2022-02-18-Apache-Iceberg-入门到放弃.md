---
title: Apache Iceberg 入门到放弃  # 博客标题（必须）
subtitle: Apache Iceberg 简介以及特性 (随便记录一下，能看就行) # 博客副标题（可选）
date: 2022-02-18  # 博客日期，会显示在文章头部（可选）
header_style: image  # 是否在博客中显示封面图：`image`（显示） / `text`（不显示）（可选，默认为 `text`）
header_img: ./images/20210404/mysql/mysql_blog_cover.png  # 博客封面图（必须，即使上一项选了 `text`，图片也需要在首页显示）
header_mask: rgba(40, 57, 101, .4)  # 封面图遮罩（可选）
catalog: true  # 是否启用右侧目录：false / true（可选，默认为 false）
tags:  # 博客标签
- 大数据
- 数据湖
- Apache Iceberg
---

## 简介

Apache Iceberg 是一种用于海量数据分析的开放式表格式。Iceberg 使用高性能的表格式将表添加到计算引擎中，包括 Spark、Trino、PrestoDB、Flink 以及 Hive，其工作形式类似于 SQL 表。

::: info 官方介绍

**Apache Iceberg is an open table format for huge analytic datasets.** Iceberg adds tables to compute engines including Spark, Trino, PrestoDB, Flink and Hive using a high-performance table format that works just like a SQL table.

:::

## 特性

Iceberg 使得**用户无需了解分区也可快速查询获得数据**，并且 Iceberg 是为大型表设计的，**单表可以包含数十PB的数据**，甚至这些大表**可以在没有分布式 SQL 引擎的情况下进行读取**，其次，Iceberg 旨在解决云端对象存储最终一致的正确性问题。简单的说，就是为了**确保云端对象存储的最终一致性**。

Iceberg 具有一下特点：

- 格式演变：支持 add、drop、update 以及 rename，并且没有副作用
- 隐藏分区：防止用户错误操作导致无提示的错误结果或者极慢的查询
- 分区布局演变：可以根据数据量或查询模式的变化更新表的布局
- Time travel：启用完全相同的表快照的可重现查询，或者使用户更容易地检查更改
- 版本回归：允许用户通过将表重置到一个良好状态来快速更正问题
- 快速扫描数据：无需分布式 SQL 引擎即可读取表或者查找文件
- 高级筛选：使用表元数据，通过分区以及列级的统计信息去除数据文件中多余部分
- 适用于任何云存储：存储在HDFS中时，通过避免 listing 以及 rename 来减少 NameNode 拥堵
- 序列化隔离：表更改事原子性的，读取操作永远无法看到部分更改或者未提交的更改
- 多并发写入：多并发写入使用乐观并发，即使写入冲突，也会重试以确保兼容的更新成功



## Flink 支持

Apache Iceberg 同时支持 Flink 的 DataStream API 和 Table API。目前，Apache Iceberg 支持 Flink 的1.12、1.13、1.14。

<table border="1">
    <tr>
        <th></th>
        <th>功能支持</th>
        <th>Flink</th>
        <th>Note</th>
    </tr>
    <tr>
        <td rowspan="9">SQL</td>
        <td>CREATE CATALOG</td>
        <td>✅</td>
        <td></td>
    </tr>
    <tr>
        <td>CREATE DATABASE</td>
        <td>✅</td>
        <td></td>
    </tr>
    <tr>
        <td>CREATE TABLE</td>
        <td>✅</td>
        <td></td>
    </tr>
    <tr>
        <td>CREATE TABLE LIKE</td>
        <td>✅</td>
        <td></td>
    </tr>
    <tr>
        <td>ALTER TABLE</td>
        <td>✅</td>
        <td>仅支持修改  table properties，不支持 column 和 partition 的更改 </td>
    </tr>
    <tr>
        <td>DROP TABLE</td>
        <td>✅</td>
        <td></td>
    </tr>
    <tr>
        <td>SELECT</td>
        <td>✅</td>
        <td>支持流和批</td>
    </tr>
    <tr>
        <td>INSERT INTO</td>
        <td>✅</td>
        <td>支持流和批</td>
    </tr>
    <tr>
        <td>INSERT OVERWRITE</td>
        <td>✅</td>
        <td></td>
    </tr>
    <tr>
        <td rowspan="3">DataStream</td>
        <td>Read</td>
        <td>✅</td>
        <td></td>
    </tr>
    <tr>
        <td>Append</td>
        <td>✅</td>
        <td></td>
    </tr>
    <tr>
        <td>overwrite</td>
        <td>✅</td>
        <td></td>
    </tr>
    <tr>
        <td>Metadata</td>
        <td>tables</td>
        <td></td>
        <td>仅支持 Java API，不支持 Flink SQL</td>
    </tr>
    <tr>
        <td>Rewrite</td>
        <td>files action</td>
        <td>✅</td>
        <td></td>
    </tr>
</table>

