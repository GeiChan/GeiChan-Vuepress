---
title: Flink SQL Client 集成 Iceberg  # 博客标题（必须）
subtitle: 随便记录一下，能看就行 # 博客副标题（可选）
date: 2022-03-07  # 博客日期，会显示在文章头部（可选）
header_style: image  # 是否在博客中显示封面图：`image`（显示） / `text`（不显示）（可选，默认为 `text`）
header_img: https://gitee.com/GeiChan/picture/raw/master/img/63372879.jpeg  # 博客封面图（必须，即使上一项选了 `text`，图片也需要在首页显示）
header_mask: rgba(40, 57, 101, .4)  # 封面图遮罩（可选）
catalog: true  # 是否启用右侧目录：false / true（可选，默认为 false）
tags:  # 博客标签
- 大数据
- Apache Flink
- Apache Iceberg
---

::: tip

需要Hadoop环境，此处不做赘述

相关包信息:

Flink 1.13.5，Iceberg 0.13.1

[Flink 下载地址](https://flink.apache.org/downloads.html#apache-flink-1136)，[Iceberg 下载地址](https://iceberg.apache.org/releases/)

:::

## 准备工作

Step1. 在有 hadoop 环境下，解压 Flink 包 `flink-1.13.5-bin-scala_2.12.tgz`，并且添加 Iceberg 的 runtime 包至 Flink 的 `lib` 目录下

```shell
# 解压 flink 包
tar -zxf flink-1.13.5-bin-scala_2.12.tgz
```



Step.2 启动 standalone 模式的 Flink 集群

```shell
# 进入 flink 目录
cd flink-1.13.5

# 启动 standalone 模式的 Flink 集群
./bin/start-cluster.sh
```



Step.3 启动 Flink SQL Client

```shell
# 启动 client
./bin/sql-client.sh
```



::: tip

若不上传 Iceberg 的 runtime 包至 Flink 目录的 `lib` 下，可以使用一下命令启动

`./bin/sql-client.sh embedded -j <iceberg-runtime-jar-directory>/iceberg-flink-runtime-xxx.jar shell`

更多 Flink SQL Client 相关，请查看 [Flink 官网](https://nightlies.apache.org/flink/flink-docs-release-1.14/zh/docs/dev/table/sqlclient/)

:::

::: tip

Iceberg 包含了 hadoop catalog 需要的 hadoop jar包，故默认只能使用 hadoop catalog。若需要使用 hive catalog，启动 Flink SQL Client 时需要加在 Hive 相关的包。

Flink 自身已提供了 Hive 相关的依赖包，[自行前往下载](https://nightlies.apache.org/flink/flink-docs-release-1.14/zh/docs/connectors/table/hive/overview/)

:::

