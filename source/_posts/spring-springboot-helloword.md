---
title: SpringBoot实战（一）入门
author: SnailDev
tags:
  - SpringBoot
  - HelloWorld
categories:
  - SpringBoot
date: 2018-09-01 21:42:56
featured_image: /images/spring-springboot-1.jpg
---
![spring-springboot-helloworld](/images/spring-springboot-1.jpg)

Spring Boot 是由 Pivotal 团队提供的全新框架，其设计目的是用来简化新 Spring 应用的初始搭建以及开发过程，该框架使用了特定的方式来进行配置，从而使开发人员不再需要定义样板化的配置。Spring Boot 默认配置了很多框架的使用方式，就像 Maven 整合了所有的 Jar 包，Spring Boot 整合了所有的框架。它的核心设计思想是：**约定优于配置**，Spring Boot 所有开发细节都是依据此思想进行实现的。
<!--more-->

Spring Boot 是一套全新的框架，它来自于 Spring 大家族，因此 Spring 所有具备的功能它都有并且更容易使用；同时还简化了基于 Spring 的应用开发，通过少量的代码就能创建一个独立的、产品级别的 Spring 应用。

下图展示出了 Spring Boot 在 Spring 生态中的位置：
![spring-springboot-helloworld](/images/spring-springboot-helloworld-2.png)

该项目主要的目的是：
- 上手 Spring 开发更快、更广泛；
- 使用默认方式实现快速开发；
- 提供大多数项目所需的非功能特性，诸如：嵌入式服务器、安全、心跳检查、外部配置等。

**Spring Boot 特性**
- 使用 Spring 项目引导页面可以在几秒构建一个项目；
- 方便对外输出各种形式的服务，如 REST API、WebSocket、Web、Streaming、Tasks；
- 非常简洁的安全策略集成；
- 支持关系数据库和非关系数据库；
- 支持运行期内嵌容器，如 Tomcat、Jetty；
- 强大的开发包，支持热启动；
- 自动管理依赖；
- 自带应用监控；
- 支持各种 IDE，如 IntelliJ IDEA、NetBeans。

## 为什么学习 Spring Boot ？
Spring Boot 本身并不提供 Spring 框架的核心特性以及扩展功能，只是用于快速、敏捷地开发新一代基于 Spring 框架的应用程序。同时它集成了大量常用的第三方库配置（如 Redis、MongoDB、JPA、RabbitMQ、Quartz 等），Spring Boot 应用中这些第三方库几乎可以零配置进行开箱即用，大部分的 Spring Boot 应用都只需要非常少量的配置代码，开发者能够更加专注于业务逻辑。

使用 Spring Boot 开发项目，有以下几方面优势：
1. Spring Boot 使开发变得简单，提供了丰富的解决方案，快速集成各种解决方案提升开发效率。
2. Spring Boot 使配置变得简单，提供了丰富的 Starters，集成主流开源产品往往只需要简单的配置即可。
3. Spring Boot 使部署变得简单，其本身内嵌启动容器，仅仅需要一个命令即可启动项目，结合 Jenkins、Docker 自动化运维非常容易实现。
4. Spring Boot 使监控变得简单，自带监控组件，使用 Actuator 轻松监控服务各项状态。

从软件发展的角度来讲，越简单的开发模式越流行，简单的开发模式解放出更多生产力，让开发人员可以避免将精力耗费在各种配置、语法所设置的门槛上，从而更专注于业务。这点上，Spring Boot 已尽可能地简化了应用开发的门槛。

Spring Boot 所集成的技术栈，涵盖了各大互联网公司的主流技术，跟着 Spring Boot 的路线去学习，基本可以了解国内外互联网公司的技术特点。

## 快速入门
说了那么多，手痒痒的很，马上来一发试试。

### maven 构建项目
1. 访问http://start.spring.io/
2. 选择构建工具Maven Project、Spring Boot版本1.5.16以及一些工程基本信息，点击“Switch to the full version.”java版本选择1.8，可参考下图所示：
![spring-springboot-helloworld](/images/spring-springboot-helloworld-3.png)
3. 点击Generate Project下载项目压缩包
4. 解压后，使用Idea，Open -> 选择解压后的文件夹中的pom.xml文件 -> Open as Project

### 项目结构介绍
![spring-springboot-helloworld](/images/spring-springboot-helloworld-4.png)
如上图所示，Spring Boot的基础结构共三个文件：
- src/main/java 程序开发以及主程序入口
- src/main/resources 配置文件
- src/test/java 测试程序

另外，Spring Boot建议的目录结构如下：

root package结构：com.example.myproject

```
com
  +- example
    +- myproject
      +- Application.java
      |
      +- domain
      |  +- Customer.java
      |  +- CustomerRepository.java
      |
      +- service
      |  +- CustomerService.java
      |
      +- controller
      |  +- CustomerController.java
      |
```
1. Application.java 建议放到根目录瞎买，主要用于做一些框架配置
2. domain 目录主要用于实体（Entity）和数据访问层（Repository）
3. service 层主要是业务逻辑代码
4. controller 负责页面访问控制

采用默认配置可以省去很多配置，当然也可以根据自己的喜欢来进行更改

最后，启动Application main方法，至此一个java项目搭建好了。

### 引入web模块
1. 在pom.xml文件中添加支持web的模块：
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

pom.xml 文件中默认有两个模块：
- spring-boot-starter: 核心模块，包括自动配置支持、日志和YAML;
- spring-boot-starter-test: 测试模块，包括JUnit、Hamcrest、Mockito;

2. 编写controller内容
```java
@RestController
public class HelloWorldController {
    @GetMapping("/hello")
    public String index(){
        return "Hello World.";
    }
}
```
@RestController的作用就是controller里面的方法都以json格式输出，不用再写jackson配置，其本质实际上就是@Controller + @ResponseBody。

3. 启动主程序，打开浏览器访问http://localhost:8080/hello，就可以看到效果了，有木有很简单！

### 单元测试
打开scr/test/java 下的测试入口，编写简单的http请求来测试：使用mockmvc实现，并利用MockMcvResultHandlers.print()打印出执行结果。
```java
@RunWith(SpringRunner.class)
@SpringBootTest
public class HelloWorldControllerTests {
    private MockMvc mvc;

    @Before
    public void setUp() throws Exception{
        mvc = MockMvcBuilders.standaloneSetup(new HelloWorldController()).build();
    }

    @Test
    public void getHello() throws Exception{
        mvc.perform(MockMvcRequestBuilders.get("/hello").accept(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andDo(MockMvcResultHandlers.print())
                .andReturn();
    }
}
```

### 热启动
热启动在正常开发项目中已经很常见了，虽然平时开发web项目过程中，改动项目后重启总是报错，但是Spring Boot对调试支持很好，修改之后可以实时生效，需要添加以下配置：
```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-devtools</artifactId>
        <optional>true</optional>
   </dependency>
</dependencies>

<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
            <configuration>
                <fork>true</fork>
            </configuration>
        </plugin>
   </plugins>
</build>
```
使用idea还需要更改一些配置，setting修改，如下图：
![spring-springboot-helloworld](/images/spring-springboot-helloworld-5.png)
然后按组合键 Shift+Ctrl+Alt+/ 选择Registry... 找到 compiler.automake.allow.when.app.running 勾选即可。

热启动模块在完整的打包环境下运行的时候会被禁用。如果你使用java -jar启动应用或者用一个特定的classloader启动，它会认为这是一个“生产环境”。

## 总结
使用spring boot可以非常方便、快速搭建项目，使我们不用关心框架之间的兼容性，适用版本等各种问题，我们想使用任何东西，仅仅添加一个配置就可以，所以使用sping boot非常适合构建微服务。

