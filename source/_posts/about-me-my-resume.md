---
title: 我的简历
author: SnailDev
tags:
  - 随手写写
categories:
  - 自我认知
date: 2018-03-08 21:09:00
featured_image: /images/avatar_resume.jpg
---

![avatar](/images/avatar_resume.jpg)

<!--more-->
[打印入口](/files/java高级研发-赵明-黄山学院-猫酷科技-4年.pdf)

# 联系方式

* 手机：15821753692（微信同号）
* Email：
    * snailtem@gmail.com （主）
    * snaildev@outlook.com （备）
* QQ：1397407698


# 个人信息

* 赵明/男/1990
* 本科/黄山学院 计算机科学与技术（2010/9--2014/7）
* 工作年限：**4年**
* 技术博客：
    *   https://snaildev.github.io
    *   http://www.cnblogs.com/snaildev
* Github：https://github.com/snaildev
* 期望职位：Java高级程序员，应用架构师
* 期望薪资：税前月薪28k+
* 期望城市：上海

# 工作经历

## 猫酷科技 （ 2015年5月 ~ 至今 ）

### 猫酷车场

实现功能：实现用户线上寻车，停车缴费等功能。

演进过程：
1. 接手：主导了猫酷车场2.0项目的研发，在1.0的基础上，对车场业务进行梳理，对上层业务代码进行封装，对底层接口对接进行开放，实现新车场接入不动上层业务代码。
2. 改进：对接口对接层进行改进，实现配置化。第三方车场接口除了是http协议之外，也有不少是webservice/wcf这种soap协议的， 解决方式是通过抓包形式，实现报文配置的统一化。
3. 持续改进：各个第三方接口的签名方式尽不相同，对接难免需要写代码实现，对于这种，解决方案是按照车场接口的厂商进行分类封装，重复对接同种厂商接口，仅需配置即可。
4. 无感停车：接入支付宝车场，并开放车场相应功能（进出场通知，离场代扣）给到线下车场，使得车辆离场时不仅可以在使用会员权益、优惠券、积分后，还可以继续使用支付宝免密支付车费，无感出场。

实现效果：系统更加稳定，用户体验更佳，对接成本从2人天降到0.5人天，目前车场平均月流水（多个商场合计）为800W左右

欢迎查阅：微信关注上海静安大悦城、近铁城市广场、上海环球港等可查看停车场功能。

猫酷车场简介：
![park](/images/park.jpg)

### 发布系统

实现功能：实现代码发布、备份管理以及服务器管理等功能。

演进过程：
1. 接手分析：对发布各个流程进行分析，代码获取、代码编译、代码发布、生产环境备份、代码同步到目的服务器、 发布异常可回滚修复以及发布完成后进行接口测试等。
    * 代码获取（源代码管理器Git）
    * 代码编译及发布（Java-->Maven, .Net-->MSBuild, .NetCore-->dotnet，静态文件发布跳过编译过程）
    * 服务器数据同步（rsync）
    * 进行接口测试（Jmeter脚本）
    * 发布结果推送给项目组成员（邮件通知）
2. 实践进行：服务器应该分环境，测试、仿真和正式。
    * 测试（研发发布，测试验证）
    * 仿真（研发组长发布，研发和测试验证）
    * 正式（就是生产环境，研发组长发布，仿真通过验证后，将仿真环境作为一个复制集同步到正式环境）

实现效果：规范了发布流程，解放了运维，使得公司约210个项目可使用发布系统稳定发布。

发布系统流程图：
![deploy](/images/deploy.jpg)

### 其他项目
* 长益预付卡系统对接
* 微信小程序发布系统
* Mongo2Es实时同步工具（https://github.com/SnailDev/SnailDev.Mongo2Es）
* MongoDB Web端查询系统（https://github.com/SnailDev/SnailDev.MongoStudio）
* 票据打印机ESC/POS指令解析（https://github.com/SnailDev/SnailDev.EscPosParser）
* NestRepository查询Es SDK封装（https://github.com/SnailDev/SnailDev.Mongo2Es/blob/master/README_NESTRepo.md）


## 博彦科技 （ 2013年10月 ~ 2015年5月 含8个月实习）

### 美国房贷系统

工作内容： 参与美国房贷系统Elliemae中WebCenter功能模块的开发和维护；即组长分配JIRA,然后根据JIRA上测试或者客户反馈的bug，进行复现，阅读源代码进行审查，修复bug，提交给组长Code Review。

开发模式： 敏捷开发，晚日报，晨站会


### 内部日报系统

工作内容：基于Asp.net MVC + Entity Framework + Bootstrap内部日报和请假系统的研发。 

工作说明：由于项目组采用的是敏捷开发模式，每日站会和日报都是必须的，为了满足日报和请假的需求，定制了一套适合项目组内部的日报系统和请假系统。并结合了AlertSystem实现了成员日报邮件提醒。

### 其他项目
* 培训考试系统
* 内部小工具（HostsHelper、FileFilter、IIsHelper等） 
* AlertSystem（基于WindowsService后台定时Email提醒服务）

# 技能清单

以下均为我熟练使用的技能

* Web开发：Java/C#.Net/Node
* Web框架：Spring/Asp.Net MVC/Express
* 前端框架：Bootstrap/Jquery/EasyUI/LigerUI/Vue
* 数据库相关：MySQL/MongoDB/Redis/ElasticSearch
* 版本管理：Svn/Git
* 单元测试：JUnit
* 云和开放平台：SAE/阿里云/腾讯云/微信应用开发

- - -
# 致谢

感谢您花时间阅读我的简历，期待能有机会和您共事。