---
title: Consul服务治理
author: SnailDev
tags:
  - 服务治理
categories:
  - 服务治理
date: 2018-05-09 17:53:00
featured_image: /images/consul.jpg
---
![consul](/images/consul.jpg)

Consul是google开源的一个使用go语言开发的服务发现、配置管理中心服务。内置了服务注册与发现框架、分布一致性协议实现、健康检查、Key/Value存储、多数据中心方案，不再需要依赖其他工具（如ZooKeeper等）。服务部署简单，只有一个可运行的二进制的包。每个节点都需要运行agent，他有两种运行模式server和client。每个数据中心官方建议需要3或5个server节点以保证数据安全，同时保证server-leader的选举能够正确的进行。
<!-- more -->

- client

    client表示Consul的client模式，就是客户端模式。是Consul节点的一种模式，这种模式下，所有注册到当前节点的服务会被转发到server，本身是不持久化这些信息。

- server

    server表示Consul的server模式，表明这个Consul是个server，这种模式下，功能和client都一样，唯一不同的是，它会把所有的信息持久化的本地，这样遇到故障，信息是可以被保留的。

- server-leader

    中间那个server下面有leader的字眼，表明这个server是它们的老大，它和其它server不一样的一点是，它需要负责同步注册的信息给其它的server，同时也要负责各个节点的健康监测。

- raft

    server节点之间的数据一致性保证，一致性协议使用的是raft，而zookeeper用的paxos，etcd采用的也是taft。

- 服务发现协议

    Consul采用http和dns协议，etcd只支持http

- 服务注册

    Consul支持两种方式实现服务注册，一种是通过Consul的服务注册http API，由服务自己调用API实现注册，另一种方式是通过json个是的配置文件实现注册，将需要注册的服务以json格式的配置文件给出。Consul官方建议使用第二种方式。

- 服务发现

    Consul支持两种方式实现服务发现，一种是通过http API来查询有哪些服务，另外一种是通过Consul agent 自带的DNS（8600端口），域名是以NAME.service.consul的形式给出，NAME即在定义的服务配置文件中，服务的名称。DNS方式可以通过check的方式检查服务。

- 服务间的通信协议

    Consul使用gossip协议管理成员关系、广播消息到整个集群，他有两个gossip  pool（LAN pool和WAN pool），LAN pool是同一个数据中心内部通信的，WAN pool是多个数据中心通信的，LAN pool有多个，WAN pool只有一个。

## 1. 安装
首先去官网现在合适的consul包：https://www.consul.io/downloads.html
安装直接下载zip包，解压后只有一个可执行的文件consul，将consul添加到系统的环境变量里面。
```bash
#unzip consul_1.0.2_linux_amd64.zip
#cp -a consul  /usr/bin
#consul
```
![1200972-20180104111330034-1408661682](/images/consul_1.png)

出现上面的内容证明安装成功。

## 2. 启动
consul必须启动agent才能使用，有两种启动模式server和client，还有一个官方自带的ui。server用与持久化服务信息，集群官方建议3或5个节点。client只用与于server交互。ui可以查看集群情况的。

**Server**

cn1：
```bash
#consul agent -bootstrap-expect 2 -server -data-dir /data/consul0 -node=cn1 -bind=192.168.1.202 -config-dir /etc/consul.d -enable-script-checks=true -datacenter=dc1 
```

cn2:
```bash
#consul agent -server  -data-dir /data/consul0 -node=cn2 -bind=192.168.1.201 -config-dir /etc/consul.d -enable-script-checks=true -datacenter=dc1 -join 192.168.1.202
```

cn3:
```bash
#consul agent -server -data-dir /data/consul0 -node=cn3 -bind=192.168.1.200 -config-dir /etc/consul.d -enable-script-checks=true -datacenter=dc1 -join 192.168.1.202
```

>参数解释：
> - -bootstrap-expect： 集群期望的节点数，只有节点数量达到这个值才会选举leader。
> - -server： 运行在server模式
> - -data-dir：指定数据目录，其他的节点对于这个目录必须有读的权限
> - -node：指定节点的名称
> - -bind：为该节点绑定一个地址
> - -config-dir：指定配置文件，定义服务的，默认所有一.json结尾的文件都会读
> - -enable-script-checks=true：设置检查服务为可用
> - -datacenter： 数据中心没名称，
> - -join：加入到已有的集群中

**Client**
```bash
#consul agent   -data-dir /data/consul0 -node=cn4 -bind=192.168.1.199 -config-dir /etc/consul.d -enable-script-checks=true  -datacenter=dc1  -join 192.168.1.202
```
client节点可以有多个，自己根据服务指定即可。

**UI**
```bash
#consul agent  -ui  -data-dir /data/consul0 -node=cn4 -bind=192.168.1.198  -client 192.168.1.198   -config-dir /etc/consul.d -enable-script-checks=true  -datacenter=dc1  -join 192.168.1.202
```

> - -ui：使用自带的ui，
> - -ui-dir：指定ui的目录，使用自己定义的ui
> - -client：指定web  ui、的监听地址，默认127.0.0.1只能本机访问。

集群创建完成后，可以使用一些常用的命令检查集群的状态：
```bash
#consul  info
```
可以在raft：stat看到此节点的状态是fllower或者leader
```bash
#consul members

Node Address Status Type Build Protocol DC Segment
cn1 192.168.1.202:8301 alive server 1.0.2 2 dc1 <all>
cn2 192.168.1.201:8301 alive server 1.0.2 2 dc1 <all>
cn3 192.168.1.200:8301 alive client 1.0.2 2 dc1 <default>
```

新加入一个节点有几种方式:
1. 这种方式，重启后不会自动加入集群
```bash
#consul  join  192.168.1.202
```

2. 在启动的时候使用-join指定一个集群
```bash
#consul agent  -ui  -data-dir /data/consul0 -node=cn4 -bind=192.168.1.198 -config-dir /etc/consul.d -enable-script-checks=true  -datacenter=dc1  -join 192.168.1.202
```

3. 使用-startjoin或-rejoin
```bash
#consul agent  -ui  -data-dir /data/consul0 -node=cn4 -bind=192.168.1.198 -config-dir /etc/consul.d -enable-script-checks=true  -datacenter=dc1  -rejoin
```
 
访问ui:
http://192.168.1.198:8500/ui

> 端口：
> 8300：consul agent服务relplaction、rpc（client-server）
> 8301：lan gossip
> 8302：wan gossip
> 8500：http api端口
> 8600：DNS服务端口

## 3. 服务注册
采用的是配置文件的方式，（官方推荐）首先创建一个目录用于存放定义服务的配置文件
```bash
#mkdir /etc/consul.d/
```
启动服务的时候要使用-config-dir 参数指定。

下面给出一个服务定义：
```bash
#cat web.json
{
	"service": {
		"name": "web",
		"tags": ["rails"],
		"port": 80,
		"check": {
			"name": "ping",
			"script": "curl -s localhost:80",
			"interval": "3s"
		}
	}
}
```
启动后就可以在没有运行web服务的机器上面执行DNS查询：
```bash
# dig @127.0.0.1 -p 8600 web.service.consul SRV

;; ANSWER SECTION:
web.service.consul.	0	IN	SRV	1 1 80 cn2.node.dc1.consul.
web.service.consul.	0	IN	SRV	1 1 80 cn3.node.dc1.consul.

;; ADDITIONAL SECTION:
cn2.node.dc1.consul.	0	IN	A	192.168.1.201
cn2.node.dc1.consul.	0	IN	TXT	"consul-network-segment="
cn3.node.dc1.consul.	0	IN	A	192.168.1.200
cn3.node.dc1.consul.	0	IN	TXT	"consul-network-segment="

;; Query time: 17 msec
;; SERVER: 127.0.0.1#8600(127.0.0.1)
;; WHEN: 四 1月 04 14:39:32 CST 2018
;; MSG SIZE rcvd: 229
```
可以看到服务已经注册到集群里面了。
使用dns查询，默认域名格式NAME.service.consul，NAME就是web.json里面定义的service的name。可以自己指定域和端口：-domain、-dns-port 53 

## 4. 健康检查
check使用来做服务的健康检查的，可以拥有多个，也可以不使用支持多种方式检查。check必须是script或者TTL类型的，如果是script类型则script和interval变量必须被提供，如果是TTL类型则ttl变量必须被提供。script是consul主动去检查服务的健康状况，ttl是服务主动向consul报告自己的状况。

- script check
```bash
{
	"check": {
		"id": mutil - memory,
		"name": "memory utilization",
		"tags": ["system"],
		"script": "/etc/init.d/check_memory.py",
		"interval": "10s",
		"timeout": "1s"
	}
}
```

- http check
```bash
{
	"check": {
		"id": "api",
		"name": "HTTP API  500",
		"http": "http://loclhost:500/health",
		"interval": "10s",
		"timeout": "1s"
	}
}
```
 
- tcp  check
```bash
{
	"check": {
		"id": "ssh",
		"name": "ssh TCP 26622",
		"tcp": "localhost:26622",
		"interval": "10s",
		"timeout": "1s"
	}
}
```

- ttl  check
```bash
{
	"check": {
		"id": "web-app",
		"name": "Web APP status",
		"notes": "Web APP does a curl  internally every 10 seconds",
		"ttl": "30s"
	}
}
```

全文完