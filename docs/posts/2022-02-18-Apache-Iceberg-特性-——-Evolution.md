---
title: Apache Iceberg 特性 —— Evolution  # 博客标题（必须）
subtitle: 随便记录一下，能看就行  # 博客副标题（可选）
date: 2022-02-19  # 博客日期，会显示在文章头部（可选）
header_style: image  # 是否在博客中显示封面图：`image`（显示） / `text`（不显示）（可选，默认为 `text`）
header_img: https://gitee.com/GeiChan/picture/raw/master/img/guidao.jpeg  # 博客封面图（必须，即使上一项选了 `text`，图片也需要在首页显示）
header_mask: rgba(40, 57, 101, .4)  # 封面图遮罩（可选）
catalog: true  # 是否启用右侧目录：false / true（可选，默认为 false）
tags:  # 博客标签
- 大数据
- 数据湖
- Apache Iceberg
---



# Evolution（演变）

Iceberg 支持表的原地演变。即使在嵌套结构中或者数据量变化时的分区布局变化，用户依旧可以像 SQL 一样演变表的 Schema。Iceberg 不受高昂代价的干扰，如重写表数据或者迁移数据至新表。

::: info 

例如，Hive 表的分区无法更改，所以从每天分区迁移数据至每小时分区，必须创建新的表。由于查询依赖ß分区，必须为新表重写查询语句。某些情况下，即使是重命名列这样的操作也是不支持的。

然而，Iceberg 就没有这样的担心

:::



## Schema Evolution（格式演变）

Iceberg 支持以下 Schema 的更改：

- add：向表或者嵌套结构中添加新的列
- drop：删除表或者嵌套结构中的已存在的列
- rename：重命名表或者嵌套结构中已存在的列或者字段
- update：更改列、结构字段、 映射键、映射值 或者 list 元素的类型
- reorder：更改嵌套结构中列或字段的顺序

::: info

Iceberg 的 Schema 更新是**对元数据的更改**，所以无需重写任何数据文件即可执行更新

:::

::: danger 注意

映射键不支持添加和删除结构字段，因为这将使 **相等性** 发生变化

:::



### 正确性

Iceberg 保证 Schema Evolution 是**独立并且无副作用的**，无需重写数据文件：

1. 添加列不会从其他列读取现有值
2. 删除列或者字段不会更改其他任何列的值
3. 更新列或者字段不会更改其他任何列的值
4. 更改列或者字段的排序不会更改与列或者字段关联的值

Iceberg 使用 **唯一ID** 来跟踪表中的每一列。添加列时，会为其分配一个新的 ID，因此永远不会错误地使用现有数据



### 分区演变

可以在现有表中更新 Iceberg 表的分区，因为查询不直接引用分区值。

在演变分区规范时，使用早期的规范写入的数据将保持不变，新数据则使用新的分区规范写入。每个分区版本的元数据都单独保留。

![](https://gitee.com/GeiChan/picture/raw/master/img/partition-spec-evolution.png)



## 排序顺序演变

与分区规范类似，Iceberg 的排序顺序也可以在现有表中更新。当您演进一个排序顺序时，使用早期顺序写入的旧数据保持不变。引擎总是可以选择以最新的排序顺序写入数据，或者在排序成本过高时选择未排序的数据。