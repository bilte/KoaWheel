# KoaWheel

# 模块说明

## Controller

负责解析用户的输入，处理后返回相应的结果，例如

- 在 RESTful 接口中，Controller 接受用户的参数，从数据库中查找内容返回给用户或者将用户的请求更新到数据库中。
- 在 HTML 页面请求中，Controller 根据用户访问不同的 URL，渲染不同的模板得到 HTML 返回给用户。
- 在代理服务器中，Controller 将用户的请求转发到其他服务器上，并将其他服务器的处理结果返回给用户。

框架推荐 Controller 层主要对用户的请求参数进行处理（校验、转换），然后调用对应的 service 方法处理业务，得到业务结果后封装并返回：

1. 获取用户通过 HTTP 传递过来的请求参数。
2. 校验、组装参数。
3. 调用 Service 进行业务处理，必要时处理转换 Service 的返回结果，让它适应用户的需求。
4. 通过 HTTP 将结果响应给用户。

## Service

在复杂业务场景下用于做业务逻辑封装的一个抽象层，提供这个抽象有以下几个好处：

保持 Controller 中的逻辑更加简洁。
保持业务逻辑的独立性，抽象出来的 Service 可以被多个 Controller 重复调用。
将逻辑和展现分离，更容易编写测试用例，测试用例的编写具体可以查看这里。

### 使用场景

- 复杂数据的处理，比如要展现的信息需要从数据库获取，还要经过一定的规则计算，才能返回用户显示。或者计算完成后，更新到数据库。
- 第三方服务的调用，比如 GitHub 信息获取等。

# scripts

```
[NODE_ENV=(环境名))] npm run (脚本名) [-- (应用参数)]

环境: development(缩写 dev), local, sit, production(缩写 prod)
默认是 development 环境

example:
本地环境下运行 start
NODE_ENV=local npm run start

npm run start // 直接启动应用
npm run debug // 使用 nodemon 启动应用, 此时会监听文件的变化, 一旦发现文件有改动, Nodemon 会自动重启应用. 一般用于开发环境
npm run stop // 杀死node进程

npm run pm2 // 使用 pm2 启动应用, 当应用死掉时, pm2 会自动重启应用. 一般用于生产环境
本项目的 pm2 采用的是 ecosystem.config 配置方式调用 pm2, 因此设置环境需要用其制定的方式,
npm run pm2 [-- --env 环境名]
pm2 kill // 停止pm2
example:
生产环境下使用 pm2 启动应用
npm run pm2 -- --env prod

npm run doc // 使用 apidoc 扫描目录(/src/controllers), 生成接口文档到目录(/doc)

npm run resetDB // 使用 sequelize 扫描目录(/src/models), 在数据库中创建对映的表. 该操作会清除所有数据.

npm run test // 调用目录(test)中的测试代码

npm run deploy // 部署到特定服务器
example:
npm run deploy -- -u http://username:password@host:22/path
```

# 使用 docker 快速搭建开发环境

## 安装

https://www.docker.com/

## docker 的一些操作

```
docker start [name] // 运行一个容器

docker images // 查看镜像
docker rmi name //   删除镜像

docker stats // 查看容器运行状态, 包括cup, 内存, 网络
docker ps // 查看所有正在运行容器
docker ps -a // 查看所有容器
docker ps -a -q // 查看所有容器ID

docker stop containerId // 停止容器 containerId 是容器的ID
docker stop $(docker ps -a -q) //  stop停止所有容器
docker rm $(docker ps -a -q) //   remove删除所有容器

```

## 常用镜像

镜像搜索去[官网](https://hub.docker.com/), 速度慢可以走[阿里云加速器](https://account.aliyun.com/login/login.htm?oauth_callback=https://cr.console.aliyun.com/&lang=zh#/accelerator)

### mysql

```
安装mysql
docker pull mysql

启动 mysql镜像创建容器
docker run -d --name mysql-a -p 127.0.0.1:3306:3306 -v /Users/01374750/docker/mysql/data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=123456  mysql:5.7

这里用5.7版本, 用8.x的版本连接不上. 初始化的时候需要目录为空

命令介绍：
-d(Detached)：表示容器将以后台模式运行，所有I/O数据只能通过网络资源或者共享卷组来进行交互。
-p 127.0.0.1:3306:3306：将主机（127.0.0.1）的端口 3306 映射到容器的端口 3306 中。方便以后连接使用。
–name mysql：给容器取名为 mysql，这样方便记忆。
-v /Users/flyPc/docker/mysql/data:/var/lib/mysql：将本机的文件目录挂载到容器对应的目录（/var/lib/mysql）中。这样可以通过数据卷实现容器中数据的持久化。
-e MYSQL_ROOT_PASSWORD=123456：-e 表示设置环境变量，此处设置了 mysql root 用户的初始密码为 123456。
mysql:latest`表示使用 mysql 为 latest 启动一个容器。
```

### redis

```
安装
docker pull redis

启动redis创建容器
docker run -d --name redis-a -p 127.0.0.1:6379:6379 -v /Users/01374750/docker/redis/data:/data redis

连接docker
docker run -it --link redis-a:redis --rm redis redis-cli -h redis -p 6379
```

### kafka

```
安装
docker pull wurstmeister/zookeeper
docker pull wurstmeister/kafka


启动
docker run -d --name zookeeper --publish 2181:2181 \
wurstmeister/zookeeper

docker run -d --name kafka --publish 9092:9092 \
--link zookeeper \
--env KAFKA_ZOOKEEPER_CONNECT=zookeeper:2181 \
--env KAFKA_ADVERTISED_HOST_NAME=127.0.0.1 \
--env KAFKA_ADVERTISED_PORT=9092 \
wurstmeister/kafka:latest

运行
运行 `docker ps`，找到kafka的 CONTAINER ID，运行 `docker exec -it ${CONTAINER ID} /bin/bash`，进入kafka容器
进入kafka默认目录 `/opt/kafka_2.11-0.10.1.0`，运行 `bin/kafka-topics.sh --create --zookeeper zookeeper:2181 --replication-factor 1 --partitions 1 --topic test`，创建一个 topic 名称为 test
运行 `bin/kafka-topics.sh --list --zookeeper zookeeper:2181` 查看当前的 topic 列表
运行一个消息生产者，指定 topic 为刚刚创建的 test ， `bin/kafka-console-producer.sh --broker-list localhost:9092 --topic test`，输入一些测试消息

再重新连接下kafka, 同样的进到默认目录下, 运行一个消息消费者，同样指定 topic 为 test， `bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic test --from-beginning`，可以接收到生产者发送的消息。
```

### node

```
docker run -d --name node-a -p 6000:3002 -v /Users/01374750/docker/node-a/data:/usr/src/app node
docker run -d --name node-a -p 127.0.0.1:3102:3002 -v /Users/01374750/docker/node-a/data:/app deploy:1.0
```
