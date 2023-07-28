---
layout: Post  # 必须
title: Flink SQL 优化 —— 谓词下推  # 博客标题（必须）
subtitle:  # 博客副标题（可选）
date: 2023-07-19  # 博客日期，会显示在文章头部（可选）
useHeaderImage: true  # 是否在博客中显示封面图：`image`（显示） / `text`（不显示）（可选，默认为 `text`）
headerImage: /img/blog_cover/2023/07/predicate-push-down-cover.png   # 博客封面图（必须，即使上一项选了 `text`，图片也需要在首页显示）
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

谓词下推（Predicate Push Down），又称为 Filter Push down，是一种查询优化技术，用于在执行查询时将谓词（即查询条件）下推到数据源（如关系型数据库）中，在数据被读取前尽可能的过滤掉无关的数据，从而提高查询性能。

谓词：在 SQL 中，谓词（Predicate）即条件表达式，就是返回 boolean 值的函数，或是隐式转换为 boolean 的函数。

下推：至于为什么是下推，单纯是因为数据存储层是作为底层了，通过 SQL 查询数据时，从数据文件中读取数据到内存加工到最后展现，整个过程是自下而上的过程。

## Flink SQL 中的谓词下推

Flink SQL 中实现完整谓词下推的仅 `FileSystemTableSource`。

那么 Flink 到底提供了哪些接口用于拓展谓词下推呢？

1. [SupportsFilterPushDown](#supportsfilterpushdown)
2. [SupportsLimitPushDown](#supportslimitpushdown)
3. [SupportsPartitionPushDown](#supportspartitionpushdown)
4. [SupportsProjectionPushDown](#supportsprojectionpushdown)

### SupportsFilterPushDown

<p style="color: #fa5d19">应用场景：将 where 中的过滤条件下推到 Source 中进行处理，这样不需要的数据就可以不往下游发送了，性能会有提升</p>

<v-icon name='pr-times-circle' fill='#E84B3C' /> 以 JDBC Connector 为例，以下是默认未实现`SupportsFilterPushDown`时的执行计划，可以很明显的看到，有一个专门的算子用于处理过滤条件

![](./img/unpush-down-filter.png)

<v-icon name='pr-check-circle' fill='#31C46E' /> 以下是重写了 `JdbcDynamicTableSource` ，实现了 `SupportsFilterPushDown` 接口后的执行计划，可以看到 Flink 将 where 的过滤条件下推到了 Source 端，在查询时就过滤掉不符合条件的数据

![](./img/push-down-filter.png)

重写 `JdbcDynamicTableSource`，实现方式

```java
public class JdbcDynamicTableSource
        implements ScanTableSource,
        LookupTableSource,
        SupportsFilterPushDown, // 此处新增实现 SupportsFilterPushDown 接口
        SupportsProjectionPushDown,
        SupportsLimitPushDown {
          
          // 省略其他原先代码
          
         /**
           * 1. 该方法的作用是将filters(过滤条件)应用到当前的DynamicTableSource上
           * 2. 该方法的返回值是一个Result对象，该对象包含两个List<ResolvedExpression>类型的属性，
           *    分别是acceptedFilters(接受的过滤条件)和remainingFilters(剩余的过滤条件)
           * 3. acceptedFilters是指那些被DynamicTableSource使用的filters，
           *    但是这些filters可能只是尽可能在原基础上被应用，
           *    因此，这些filters的信息可以帮助planner来调整当前plan的成本估算
           * 4. remainingFilters是指那些不能被DynamicTableSource完全消费的filters，
           *    这些filters决定了是否需要在runtime阶段继续应用filter操作
           * 5. acceptedFilters和remainingFilters不能是disjunctive lists，
           *    一个filter可以同时出现在这两个list中，但是所有的filters必须至少出现在其中一个list中
           */
          @Override
          public Result applyFilters(List<ResolvedExpression> filters) {
              this.filters = filters;
              return Result.of(this.filters, Lists.newArrayList());
          }
}
```



### SupportsLimitPushDown

<p style="color: #fa5d19">应用场景：将 limit 子句下推到 Source 中，在批场景中可以过滤大部分不需要的数据</p>

### SupportsPartitionPushDown

<p style="color: #fa5d19">应用场景：常用于批处理场景，带有 Partition 属性的 Source，将所有的 Partition 数据获取到之后，然后在 Source 层面决定哪个 Source 算子读取哪些 Partition 的数据，而不必在 Source 后过滤。比如 Hive 表的 Partition，将所有 Partition 获取到之后，然后决定某个 Source 算子应该读取哪些 Partition</p>

### SupportsProjectionPushDown

<p style="color: #fa5d19">应用场景：将下游用到的字段下推到 Source 中，然后 Source 中可以做到只取这些字段，不使用的字段就不往下游发</p>









