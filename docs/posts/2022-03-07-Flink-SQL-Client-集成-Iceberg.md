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

# 添加 Iceberg 运行时依赖
cp iceberg-flink-runtime-1.13-0.13.1.jar <flink_path>/lib/
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

## CREATE CATALOG 以及 Catalog 使用

> 本案例以 hadoop catalog 为使用例子

```sql
# 创建 hadoop catalog
CREATE CATALOG hadoop_catalog WITH (
	'type' = 'iceberg',
    'catalog-type' = 'hadoop',
    'warehouse' = 'hdfs://node2.hexinfo.com:8020/warehouse',
    'property-version' = '1'
);

# 使用 hadoop catalog
use catalog hadoop_catalog;
```

- `type` ：只能是 `iceberg`，必填项
- `catalog-type` ：定义构建的 catalog 类型，`hive` 或者 `hadoop` 或者 `自定义catalog`，选填，默认 `hadoop`
- `warehouse` ：HDFS 上存储元数据文件和数据文件的地址，必填项

查看执行结果：

```shell
Flink SQL> CREATE CATALOG hadoop_catalog WITH ( 'type' = 'iceberg', 'catalog-type' = 'hadoop', 'warehouse' = 'hdfs://node2.hexinfo.com:8020/warehouse', 'property-version' = '1');
[INFO] Execute statement succeed.

Flink SQL> show catalogs;
+-----------------+
|    catalog name |
+-----------------+
| default_catalog |
|  hadoop_catalog |
+-----------------+
2 rows in set
```

## DDL 命令

### CREATE DATABASE

```sql
＃　创建 DATABASE
CREATE DATABASE `iceberg_db`;

# USE DATABASE
USE `iceberg_db`;
```

```shell
Flink SQL> CREATE DATABASE `iceberg_db`;
[INFO] Execute statement succeed.

Flink SQL> show databases;
+---------------+
| database name |
+---------------+
|      autoflow |
|       default |
|    iceberg_db |
+---------------+
3 rows in set
```

### CREATE TABLE

```sql
CREATE TABLE `iceberg_db`.`table_create_test` (
    `id` BIGINT COMMENT '主键',
    `name` STRING,
    `age` BIGINT,
    `date` STRING
) PARTITIONED BY (`date`)
COMMENT '建表测试';
```

- `COMMENT 'xxx'` ： 定义 column 或者 table 的描述
- `PARTITIONED BY (column1, column2)` ：定义分区列，Flink 暂不支持隐藏分区

### ALTER TABLE

```sql
ALTER TABLE `hadoop_catalog`.`iceberg_db`.`table_create_test` SET ('write.format.default' = 'orc');
```

::: danger

目前，在 Flink 中，Iceberg 仅支持修改 table 配置

:::

### ALTER TABLE ... RENAME TO

```sql
# 修改表名
ALTER TABLE `hadoop_catalog`.`iceberg_db`.`table_create_test` RENAME TO `hadoop_catalog`.`iceberg_db`.`update_table_name`;
```

### DROP TABLE

```sql
DROP TABLE `hadoop_catalog`.`iceberg_db`.`update_table_name`;
```

## QUERY

```sql
SELECT * FROM `hadoop_catalog`.`iceberg_db`.`table_create_test`;
```

## INSERT

```sql
# INSERT INTO
INSERT INTO `hadoop_catalog`.`iceberg_db`.`table_create_test` VALUES (1, 'a', 18, '2022-03-01');
INSERT INTO `hadoop_catalog`.`iceberg_db`.`table_create_test` SELECT `id`, `name`, `age`, `date` from other_kafka_table;

# INSERT OVERWRITE
INSERT OVERWRITE `hadoop_catalog`.`iceberg_db`.`table_create_test` VALUES (1, 'a', 18, '2022-03-01');
INSERT OVERWRITE `hadoop_catalog`.`iceberg_db`.`table_create_test` SELECT `id`, `name`, `age`, `date` from other_kafka_table;
```

::: danger

Flink 流式处理将数据追加到表中，请使用：`INSERT INTO`

若需要使用 `INSERT OVERWRITE` ，请使用 Flink 批处理模式，即 `SET execution.type = batch `

:::