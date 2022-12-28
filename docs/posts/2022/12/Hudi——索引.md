---
layout: Post  # 必须
title: Hudi——索引  # 博客标题（必须）
subtitle:  # 博客副标题（可选）
date: 2022-12-26  # 博客日期，会显示在文章头部（可选）
useHeaderImage: true  # 是否在博客中显示封面图：`image`（显示） / `text`（不显示）（可选，默认为 `text`）
headerImage: /img/blog_cover/2022/12/hudi_indexing.png   # 博客封面图（必须，即使上一项选了 `text`，图片也需要在首页显示）
headerMask: rgba(40, 57, 101, .4)  # 封面图遮罩（可选）
catalog: true  # 是否启用右侧目录：false / true（可选，默认为 false）
permalinkPattern: /post/:year/:month/:slug/
tags:  # 博客标签
- 大数据
- hudi
---

## 索引 Indexing

Hudi 通过一种索引机制提供高效地 Upsert，这种机制具体是将给定的 hoodie key(record key + partition path) 与文件id建立唯一映射。这种映射关系在第一次写入到文件中后将不再更改。简而言之，映射文件组包含了一组record的所有版本。

对于 COW 表，索引可以实现快速的 upsert/delete 操作，避免了需要结合整个数据集来确定文件是否重写。

对于 MOR 表，这种设计允许 Hudi 限定所有给定的基本文件需要合并的记录数量。具体来说，给定的基本文件只需要根据作为该基本文件一部分的记录的更新进行合并。没有索引组件（例如：Apache Hive ACID）的设计可能最终不得不根据所有传入的更新/删除记录合并所有基本文件。

索引机制，可以做到：避免读取不需要的文件、避免更新不必要的文件、无需将更新数据与历史数据做分布式关联，只需要在文件组内做合并

![更新基本文件的合并成本比较](./img/with-and-without-index.png)

## 索引类型

| 索引类型                | 原理                                                         | 优点                                          | 缺点                                                         |
| ----------------------- | ------------------------------------------------------------ | --------------------------------------------- | ------------------------------------------------------------ |
| Bloom Index             | 使用基于 record key 构建的布隆过滤器判断记录是否存在，也可以选择使用 record key ranges 修剪需要的文件 | 效率高，不依赖外部系统，数据和索引保持一致性  | 因Hash冲突问题导致的误判，还需要回溯原文件重新查             |
| Simple Index            | 将传入的 update/delete 记录根据 key 与存储在表中的数据进行关联 | 实现最简单，无需额外的资源                    | 性能差                                                       |
| HBase Index             | 在HBase中管理索引映射                                        | 对于小批次的key，查询效率高                   | 需要额外维护HBase系统                                        |
| 自定义实现              | 拓展公共API，实现自定义索引                                  | 灵活度高                                      | 需要一定的开发能力                                           |
| 基于 Flink State 的索引 | Hudi 在0.8.0版本中实现了Flink Writer，采用了 Flink 的 state 作为底层的索引存储，每个 record 在写入之前都会先计算目标 Bucket ID | 相比BloomFilter，避免了每次重复的文件索引查找 | 过大的索引，会导致内存使用变大，影响到 Checkpoint，随可以通过Flink的状态调优调整，但是需要对Flink有一定的使用经验 |

> ==在 Flink 中使用 Hudi，只有 基于 state 的索引==，其余索引都是 Spark 的可选配置。

### 全局索引与非全局索引

- 全局索引: 全局索引在表的所有分区中强制要求 key 的唯一性，保证对于给定的 record key，在表中只存在一条记录。全局索引提供了有力的保证，但是 update/delete 成本随表的大小而增加，因此适用于小表
- 非全局索引: 默认的索引实现，非全局索引依赖写入器为同一个 record key 的 update/delete 提供一致的分区路径，从而提供更好的性能，因此更适合大表

> HBase Index 本质上就是一个全局索引。
