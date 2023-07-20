---
layout: Post  # 必须
title: Mysql 5.7 安装  # 博客标题（必须）
subtitle: 新服务器总是要安装 Mysql，但是又记不住，就只能写下来了  # 博客副标题（可选）
date: 2021-04-04  # 博客日期，会显示在文章头部（可选）
useHeaderImage: true  # 是否在博客中显示封面图：`image`（显示） / `text`（不显示）（可选，默认为 `text`）
headerImage: /img/blog_cover/2021/04/mysql_blog_cover.png   # 博客封面图（必须，即使上一项选了 `text`，图片也需要在首页显示）
headerMask: rgba(40, 57, 101, .4)  # 封面图遮罩（可选）
catalog: true  # 是否启用右侧目录：false / true（可选，默认为 false）
permalinkPattern: /post/:year/:month/:slug/
tags:  # 博客标签
  - Mysql
---

::: tip Tips

本文安装的Mysql 5.7，当然，如果需要更高版本的，可以按照 `Step.4` 修改文件中的`enable`的值（1：启用，0：关闭）即可。

:::

## Step.1 检查并卸载系统原装MySQL

- 执行命令 `rpm -qa | grep mysql`，查找系统是否装有 MySQL

- 若已安装 MySQL，需要停止 MySQL 服务，并删除之前安装的 MySQL

  ```shell
  # 停止MySQL服务
  systemctl stop mysqld
  
  # 删除软件命令（需要删除已有的所有MySQL的rpm包）
  rpm -e --nodeps 包名
  ```

- 删除老版本的 MySQL 目录以及 MySQL 的配置等

  ```shell
  # 查找 mysql 相关的目录
  find / -name mysql
  
  # 删除老版本mysql的文件
  rm -rf my.cnf 以及 my.cnf.d 的目录
  ```



## Step.2 yum 设置阿里源 (阿里镜像MySQL下载快)

```shell
# 1. 备份原先的镜像文件
cd /etc/yum.repos.d
mv CentOS-Base.repo CentOS-Base.repo.backup

# 2. 下载阿里云的 CentOS-Base.repo 到 /etc/yum.repos.d/ 目录下
wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo	

# 3. 清理 yum 软件源缓存
yum clean all

# 4. 生成新的 yum 元数据缓存
yum makecache
```



## Step.3 下载配置MySQL的rpm包

```shell
# 自行创建mysql rpm包的存放路径
# 1.下载rpm包
wget https://repo.mysql.com//mysql80-community-release-el7-3.noarch.rpm

# 2.安装myaql源
yum localinstall -y mysql80-community-release-el7-3.noarch.rpm

# 3.检查MySQL源是否安装成功，此时查到的安装包的版本都是mysql8.0版本的
yum repolist enabled | grep "mysql.*-community.*"
```

![](./img/mysql源的安装结果.png)

```shell
# 4.修改yum源配置文件，获取自己想要安装的mysql5.7版本
vim /etc/yum.repos.d/mysql-community.repo
```

![](./img/mysql源配置修改.png)

修改红框中的内容，将 MySQL 5.7 的 `enabled=0` 改为 `enabled=1`，将 MySQL 8.0 的 `enabled=1` 改为 `enabled=0`，保存退出后，重新执行命令 `yum repolist enabled | grep "mysql.*-community.*"`，查看当前 MySQL 源版本是否是 5.7

![](./img/修改后的mysql源信息.png)



## Step.4 安装MySQL

```shell
yum -y install mysql-community-server
```



## Step.5 启动MySQL服务

```shell
# 1.临时启动mysql服务
systemctl start mysqld

# 2.开机启动mysql服务
systemctl enable mysqld

# 3.查看MySQL的启动状态
systemctl status mysqld
```



## Step.6 修改MySQL本地的root登录密码

MySQL 安装完成后，在 `/var/log/mysqld.log` 文件中，可以找到安装 MySQL 时自动生成的 root 密码

```shell
grep 'temporary password' /var/log/mysqld.log
```

![](./img/查询mysql默认密码.png)

```shell
# 1.使用以上找到的密码登录MySQL
mysql -u root -p

# 2. 修改root用户密码
ALTER USER 'root'@'localhost' IDENTIFIED BY 'Shhex!1324';

# 3. 开启用户远程登录
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY 'Shhex!1324' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```

::: tip Tips

如果是开发或者测试环境，建议 在 `/etc/my.cnf` 中添加一段 `validate_password=off` ，关闭密码策略。（修改配置文件后，需要重启mysql服务，命令行`systemctl restart mysqld`）

:::



##  常见问题

#### 执行 `yum -y install mysql-community-server`，如遇以下问题

::: danger 错误信息

源 "MySQL 5.7 Community Server" 的 GPG 密钥已安装，但是不适用于此软件包。请检查源的公钥 URL 是否配置正确。

:::

##### 官方有说到：

If you are using RPM 4.1 and it complains about (GPG) NOT OK (MISSING KEYS: GPG#3a79bd29), even though you have imported the MySQL public build key into your own GPG keyring, you need to import the key into the RPM keyring first. RPM 4.1 no longer uses your personal GPG keyring (or GPG itself). Rather, RPM maintains a separate keyring because it is a system-wide application and a user’s GPG public keyring is a user-specific file. To import the MySQL public key into the RPM keyring, first obtain the key, then use rpm --import to import the key

##### 可以执行一下命令行解决：

```shell
## 2022-07-14 
rpm --import https://repo.mysql.com/RPM-GPG-KEY-mysql-2022
```

