---
layout: Post  # 必须
title: CDH安装  # 博客标题（必须）
subtitle: 也就随便记录一下，能看就行，环境需要时看看  # 博客副标题（可选）
date: 2021-05-01  # 博客日期，会显示在文章头部（可选）
useHeaderImage: true  # 是否在博客中显示封面图：`image`（显示） / `text`（不显示）（可选，默认为 `text`）
headerImage: /img/blog_cover/2021/05/cdh_install_blog_cover2.jpeg   # 博客封面图（必须，即使上一项选了 `text`，图片也需要在首页显示）
headerMask: rgba(40, 57, 101, .4)  # 封面图遮罩（可选）
catalog: true  # 是否启用右侧目录：false / true（可选，默认为 false）
permalinkPattern: /post/:year/:month/:slug/
tags:  # 博客标签
- 大数据
- CDH
---

## 一、集群规划

| hostname           | 主机别名 | IP            | 角色                             |
| ------------------ | -------- | ------------- | -------------------------------- |
| master.hexinfo.com | master   | 172.18.26.129 | Hadoop主节点，CM服务器，数据节点 |
| node1.hexinfo.com  | node1    | 172.18.25.145 | 数据节点                         |
| node2.hexinfo.com  | node2    | 172.18.25.60  | 数据节点，MySQL                  |

## 二、系统环境准备

### 1、配置网络名称

#### 1.1 配置集群中的每一台服务器的主机名(HOSTNAME)

::: tip Tips

主机名必须是FQDN(全限定域名)，且必须唯一

:::

主机名设置命令：`hostnamectl set-hostname 主机名`

```shell
# 各服务器执行的命令
# 172.18.26.129
hostnamectl set-hostname master.hexinfo.com

# 172.18.25.145                            
hostnamectl set-hostname node1.hexinfo.com

# 172.18.25.145
hostnamectl set-hostname node2.hexinfo.com
```

#### 1.2 将集群各机子的IP和全限定域名绑定

编辑 `/etc/hosts` 文件（命令：`vim /etc/hosts`）

::: tip Tips

配置时，也可以添加非限定域名，即别名

:::

```shell
# 所有集群机器都需配置
# ip 主机名
172.18.26.129 master.hexinfo.com master
172.18.25.145 node1.hexinfo.com node1
172.18.25.60  node2.hexinfo.com node2
```

![](./img/hosts.png)

#### 1.3 为集群各节点主机设置hostname

编辑 `/etc/sysconfig/network` ，写入一下内容

```shell
# master节点
HOSTNAME=master.hexinfo.com

# node1节点
HOSTNAME=node1.hexinfo.com

# node2节点
HOSTNAME=node2.hexinfo.com
```

### 2、关闭防火墙

```shell
# 查看防火墙状态
systemctl status firewalld

# 关闭防火墙
systemctl stop firewalld

# 禁用防火墙
systemctl disable firewalld
```

### 3、关闭SELinux模式

执行 `getenforce`，检查SELinux状态

```shell
[root@master ~]# getenforce
Disabled
```

- 若输出 `Permissive` 或者 `Disable` ，则进行下一步；

- 若输出 `enforcing`，编辑 `/etc/selinux/config` 文件，修改 `SELINUX=enforcing` 行的值为 `SELINUX=Disable` ，保存后，重启系统 或者执行 `setenforce 0` 命令，立即禁用SELinux模式

### 4、同步服务器时间

若时间不同步，可以使用 `ntp` 服务，同步各节点服务器的时间，以Master节点服务器的时间为准。 

### 5、安装JDK

在所有服务器上安装JDK：

- 执行命令  `rpm -qa | grep jdk`，查看是否安装有OpenJDK，若有，则卸载

- 上传 `jdk-8u161-linux-x64.rpm` 到服务器，执行 `rpm -ivh jdk-8u161-linux-x64.rpm` 命令，安装JDK

```shell
## 默认安装路径
/usr/java/jdk1.8.0_161
```

- 使用 `java -version` 查看JDK版本，验证是否安装成功

## 二、上传CM(Cloudera Manager)相关RPM包，并安装CM

### 1、上传CM相关rpm包

```shell
[root@master cm]# ll
总用量 1380424
-rw-r--r-- 1 root root   10483568 10月 14 17:43 cloudera-manager-agent-6.3.1-1466458.el7.x86_64.rpm
-rw-r--r-- 1 root root 1203832464 10月 14 17:52 cloudera-manager-daemons-6.3.1-1466458.el7.x86_64.rpm
-rw-r--r-- 1 root root      11488 10月 14 17:43 cloudera-manager-server-6.3.1-1466458.el7.x86_64.rpm
```

```shell
[root@lab-cdh-wml0 cdh]# ll
总用量 2033436
-rw-r--r-- 1 root root 2082186246 10月 14 17:32 CDH-6.3.2-1.cdh6.3.2.p0.1605554-el7.parcel
```

执行命令 `sha1sum CDH-6.3.2-1.cdh6.3.2.p0.1605554-el7.parcel | awk '{ print $1 }' > CDH-6.3.2-1.cdh6.3.2.p0.1605554-el7.parcel.sha`
> parcel 包部分也就放着做个记录，以防需要

### 2、安装Cloudera Manager Server 以及 Cloudera Manager Agent

```shell
# 先安装 cloudera-manager-daemons, 这是 Cloudera Manager Agent 的依赖部分
rpm -ivh cloudera-manager-daemons-6.3.1-1466458.el7.x86_64.rpm 

# 安装 clouder-manager-agent
rpm -ivh cloudera-manager-agent-6.3.1-1466458.el7.x86_64.rpm

# 安装 clouder-manager-server, 只需要安装master节点
rpm -ivh cloudera-manager-server-6.3.1-1466458.el7.x86_64.rpm
```

::: tip Tips

Server 只有 Master 节点需要安装， Agent 所有节点都需要装

若以上命令存在`依赖检查失败`的问题，加上 `--nodeps --force`

:::

### 3、修改所有节点Agent配置

执行命令 `vim /etc/cloudera-scm-agent/config.ini`，修改文件中的 `server_host` 的值，更改为安装Cloudera Manager Server的服务器全限定域名

![](./img/agent配置.png)

::: warning 注意

如果开启了ipv6，这个地方就不能写服务器的hostname了，要使用服务器的 IP 地址，否则CM将无法运行服务监测，会提示 `Host Monitor 未运行`

:::

### 4、为CM使用，安装MySQL连接驱动

> Mysql的安装不多赘述

```shell
# 下载连接驱动
wget https://dev.mysql.com/get/Downloads/Connector-J/mysql-connector-java-5.1.46.tar.gz

# 提取jar文件
tar zxvf mysql-connector-java-5.1.46.tar.gz
```

复制MySQL的驱动jar包到 `/usr/share/java` 目录下

```shell
cp mysql-connector-java-5.1.46-bin.jar /usr/share/java/mysql-connector-java.jar
```

> 若不存在  `/usr/share/java`  目录，则手动创建一个

### 5、为Clouder创建数据库

为需要使数据库的组件创建数据库：

- Cloudera Manager Server
- Cloudera Manager Service roles (分为 `Activity Monitor` (活动监视器) 和 `Reports Manager` (报表管理器))
- Hue
- Hive 元数据存储
- Sentry Server
- Cloudera Navigator Audit Server
- Cloudera Navigator Metadata Server
- Oozie

| 服务组件                           | 数据库名  | 用户名 |
| ---------------------------------- | --------- | ------ |
| Cloudera Manager Server            | scm       | scm    |
| Activity Monitor                   | amon      | amon   |
| Reports Manager                    | rman      | rman   |
| Hue                                | hue       | hue    |
| Hive 元数据                        | metastore | hive   |
| Sentry Server                      | sentry    | sentry |
| Cloudera Navigator Audit Server    | nav       | nav    |
| Cloudera Navigator Metadata Server | navms     | navms  |
| Oozie                              | oozie     | oozie  |

```mysql
-- 创建 Cloudera Manager Server 用户和数据库
CREATE DATABASE IF NOT EXISTS scm DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;
CREATE USER 'scm'@'%' IDENTIFIED BY 'scm';
GRANT ALL ON scm.* TO 'scm'@'%' IDENTIFIED BY 'scm';

-- 创建 Activity Monitor 用户和数据库
CREATE DATABASE IF NOT EXISTS amon DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;
CREATE USER 'amon'@'%' IDENTIFIED BY 'amon';
GRANT ALL ON amon.* TO 'amon'@'%' IDENTIFIED BY 'amon';

-- 创建 Reports Manager 用户和数据库
CREATE DATABASE IF NOT EXISTS rman DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;
CREATE USER 'rman'@'%' IDENTIFIED BY 'rman';
GRANT ALL ON rman.* TO 'rman'@'%' IDENTIFIED BY 'rman';

-- 创建 Hue 用户和数据库
CREATE DATABASE IF NOT EXISTS hue DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;
CREATE USER 'hue'@'%' IDENTIFIED BY 'hue';
GRANT ALL ON hue.* TO 'hue'@'%' IDENTIFIED BY 'hue';

-- 创建 Hive 元数据 用户和数据库
CREATE DATABASE IF NOT EXISTS hive DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;
CREATE USER 'hive'@'%' IDENTIFIED BY 'hive';
GRANT ALL ON hive.* TO 'hive'@'%' IDENTIFIED BY 'hive';

-- 创建 Sentry Server 用户和数据库
CREATE DATABASE IF NOT EXISTS sentry DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;
CREATE USER 'sentry'@'%' IDENTIFIED BY 'sentry';
GRANT ALL ON sentry.* TO 'sentry'@'%' IDENTIFIED BY 'sentry';

-- 创建 Cloudera Navigator Audit Server 用户和数据库
CREATE DATABASE nav DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;
CREATE USER 'nav'@'%' IDENTIFIED BY 'nav';
GRANT ALL ON nav.* TO 'nav'@'%' IDENTIFIED BY 'nav';

-- 创建 Cloudera Navigator Metadata Server 用户和数据库
CREATE DATABASE IF NOT EXISTS navms DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;
CREATE USER 'navms'@'%' IDENTIFIED BY 'navms';
GRANT ALL ON navms.* TO 'navms'@'%' IDENTIFIED BY 'navms';

-- 创建 Oozie 用户和数据库
CREATE DATABASE IF NOT EXISTS oozie DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;
CREATE USER 'oozie'@'%' IDENTIFIED BY 'oozie';
GRANT ALL ON oozie.* TO 'oozie'@'%' IDENTIFIED BY 'oozie';
```

::: warning

使用以上语句时，可能存在`Your password does not satisfy the current policy requirements` 错误，是由于数据库用户的密码过于简单导致的

如果是开发或者测试环境，建议 在 `/etc/my.cnf` 中添加一段 `validate_password=off` ，关闭密码策略 

当然你也可以设置更为复杂的密码

:::

### 6、设置Cloudera Manager数据库

```shell
/opt/cloudera/cm/schema/scm_prepare_database.sh mysql scm scm scm

# 若数据库所在的服务器与Cloudera Manager Server所在服务不是同一台的话，使用一下命令
/opt/cloudera/cm/schema/scm_prepare_database.sh -h <host> -P <port> mysql scm scm scm
```
::: tip Tips

`scm_prepare_database.sh` 脚本语法：

`/opt/cloudera/cm/schema/scm_prepare_database.sh [options] <databaseType> <databaseName> <databaseUser> <password>`

:::

![](./img/设置ClouderaManagerServer数据库.png)

### 7、启动Cloudera Manager Server 以及 Cloudera Manager Agent

```shell
# 启动 Cloudera Manager 服务
systemctl start cloudera-scm-server.service

# 查看启动日志
tail -f /var/log/cloudera-scm-server/cloudera-scm-server.log

# Cloudera Manager Server 启动完成后，各节点服务器启动 Cloudera Manager Agent
systemctl start cloudera-scm-agent.service
```

> `INFO WebServerImpl:com.cloudera.server.cmf.WebServerImpl: Started Jetty server.` 
>
> 出现该信息时，表示服务启动完毕！

### 8、浏览器中访问Cloudera Manager

浏览器中访问：`http://主机ip:7180`

默认凭证：

- 用户：admin
- 密码：admin

### 9、集群设置

登录页面会有Welcome欢迎页，一直继续，选择版本页面，可以选择60天试用的企业版

#### 9.1 集群安装

##### 9.1.1 Cluster Basics

输入群集名称，然后单击 *继续*

::: tip Tips

Cluster Basics：允许用户指定**集群名称**，并选择**集群类型**

- 常规集群：查柜集群包含存储节点、计算节点和其他服务，如单个集群中并存的元数据和安全
- 计算集群：计算集群**仅由计算节点组成**，若要连接到现有存储、元数据或安全服务，必须先在基础集群上选择或创建数据上下文

Tips：新安装时，只能选择**常规集群**。如果没有常规集群，则无法添加计算集群

:::

##### 9.1.2 Specify Hosts

指定哪些主机将运行CDH和其他托管服务

![](./img/集群安装_选择主机.png)

::: tip Tips

若没有`当前管理主机` 这栏，可能未启动Cloudera Manager Agent。

可以使用`systemctl status cloudera-scm-agent.service` 查看一下启动状态，未启动的话，使用`systemctl start cloudera-scm-agent.service`启动，然后刷新页面即可

:::

##### 9.1.3 选择存储库

![](./img/集群安装_选择存储库.png)

###### CDH and other software 部分

选择安装方法

- 使用数据包
  一种标准的二进制分发格式，包含已编译的代码和元信息。使用操作系统的包管理器安装包

- 使用Parcel（推荐）

  Parcel 是包含程序文件的二进制分发格式，以及Cloudera Manager使用的其他元数据。

::: warning 注意

注意：如果使用 Parcel 安装，需要在`其他Parcel` 选择需要安装的 Parcel。

特别提醒：如果安装CDH 6，请勿选择KAFKA、KUDU、SPARK的Parcel，因为CDH 6中已经包含了这些 Parcel

:::

##### 9.1.4 Install Parcel

等待Parcel安装完成，*继续* 即可。

##### 9.1.5 Inspect Cluster

点击这两个位置的 `Inspect Network Performance` 和 `Inspect Hosts`。

![](./img/环境检测.png)

检查完毕后，解决报告中的问题。若无法解决，直接选择第三项，“我理解风险，让我继续创建集群”，然后点击继续。

#### 9.2 集群相关配置

##### 9.2.1 选择服务

![](./img/选择服务.png)

##### 9.2.2 自定义角色分配

![](./img/角色分配至各个主机.png)

##### 9.2.3 数据库设置

![](./img/数据库设置.png)

选择使用的数据库类型，并填入先前创建的数据库连接信息，点击测试连接，正常连接即可。

##### 9.2.4 审核更改

查看并进行必要的更改即可。一般默认即可，直接继续。

##### 9.2.5 命令详细信息

会列出运行命令的详细信息。首次安装完成后，点击继续即可。

##### 9.2.6 汇总

报告设置向导的安装结果。点击完成即可。

到此，即安装完毕了！剩下的就是组件的配置了。







