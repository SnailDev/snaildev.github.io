---
title: SpringBoot实战（二）Web
author: SnailDev
tags:
  - SpringBoot
  - Web综合开发
categories:
  - SpringBoot
date: 2018-09-02 20:36:41
featured_image: /images/spring-springboot-1.jpg
---
![spring-springboot-web](/images/spring-springboot-1.jpg)

Spring Boot Web开发非常的简单，其中包括常用的json输出、filters、property、log等。
<!--more-->

## 接口开发

在以前的spring开发的时候需要我们提供json接口的时候需要做以下配置：
1. 添加jackon等相关jar包
2. 配置spring controller扫描
3. 对接的方法添加@ResponseBody

就这样我们会经常由于配置问题，导致406错误等等，那么spring boot是如何做的呢，只需要给Controller类添加`@RestController` 注解即可，那么默认类中的方法都会以json的格式返回。
```java
@RestController
public class HelloWorldController {
    @GetMapping("/getUser")
    public User getUser(){
        User user = new User();
        user.setUserName("snaildev");
        user.setPassword("123456");
        return user;
    }
}
```
如果我们需要使用页面开发只要使用`@Controller`，下面会结合模板来说明。

## 自定义Filter
我们常常在项目中会使用filters用于记录调用日志、排除有XSS威胁的字符、执行权限验证等等。Spring Boot自动添加了OrderedCharacterEncodingFilter和HiddenHttpMethodFilter,并且我们可以自定义Filter。

两个步骤：
1. 实现Filter接口，实现Filter方法；
2. 添加`@Configuration` 注解，将自定义的Filter加入过滤链；

ok，直接上代码

WebConfiguration.java
```java
@Configuration
public class WebConfiguration {
    @Bean
    public RemoteIpFilter remoteIpFilter(){
        return new RemoteIpFilter();
    }

    @Bean
    public FilterRegistrationBean filterRegistrationBean(){
        FilterRegistrationBean registrationBean = new FilterRegistrationBean();
        registrationBean.setFilter(new MyFilter());
        registrationBean.addUrlPatterns("/*");
        registrationBean.addInitParameter("paramName","paramValue");
        registrationBean.setName("MyFilter");
        registrationBean.setOrder(1);

        return registrationBean;
    }
}
```

MyFilter.java
```java
public class MyFilter implements Filter {
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {

    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        System.out.println("this is MyFilter，url：" + request.getRequestURI());
        filterChain.doFilter(servletRequest, servletResponse);
    }

    @Override
    public void destroy() {

    }
}
```

## 自定义Property
在Web开发中，我们经常需要自定义一些配置文件，如何使用呢?

**配置在application.properties中**
```
com.example.title=SnailDev's Blog
com.example.description=Coding is everything in my life. 
```

自定义配置类
```java
@Component
public class ExampleProperties {
    @Value("${com.example.title}")
    private String title;
    @Value("${com.example.description}")
    private String description;

    //省略getter settet方法

    }
```

**log配置**
配置输出的地址和输出的级别
```
logging.path=/user/local/log
logging.level.com.example=DEBUG
logging.level.org.springframework.web=INFO
logging.level.org.hibernate=ERROR
```
path为本机log地址，logging.level 后面可以根据包路径配置不同资源的log级别

## 数据库操作
在这里我们重点来看一下mysql、spring data jpa的使用，其中mysql就不用说了，大家应该都很熟悉，jpa是利用Hibernate生成各种自动化的sql，如果只是简单的增删改查，基本上不用手写了，spring 内部已经帮我们封装实现了。

下面简单介绍一下如何在spring boot中简单使用

### 1. 添加相关的jar包依赖
```xml
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<dependency>
	<groupId>mysql</groupId>
	<artifactId>mysql-connector-java</artifactId>
</dependency>
```

### 2. 添加配置文件
```
spring.datasource.url=jdbc:mysql://localhost:3306/test
spring.datasource.username=root
spring.datasource.password=123456
spring.datasource.driver-class-name=com.mysql.jdbc.Driver

spring.jpa.properties.hibernate.hbm2ddl.auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL5InnoDBDialect
spring.jpa.show-sql=true
```
其实这个hibernate.hbm2ddl.auto参数的作用主要用于：自动创建|更新|验证数据库表结构，有四个值：
1. create：每次加载hibernate时都会删除上一次生成的表，然后根据model类再重新生成新表，哪怕两次没有任何改变也会这样执行，这就是导致数据库数据丢失的一个重要原因。
2. create-drop：每次加载hibernate时根据model类生成表，但是sessionFactory一关闭，表就自动删除。
3. update：最常用的属性，第一次加载hibernate时根据model类会自动建立表的结构（数据库先建好），以后加载hibernate时根据model类自动更新表结构，即使表结构改变了但表中的行仍然存在不会被删除。要留意的是当部署到服务器后，表结构是不会被马上建立ilai的，是要等应用第一次运行起来后才会。
4. validate：每次加载hibernate时，验证创建数据库表结构，只会和数据库中的表进行比较，不会创建新表，但是会插入新值。

`dialect` 主要是指定生成表名的存储引擎为InneoDB
`show-sql` 是否打印出自动生成的SQL,方便调试的时候查看

### 3. 添加实体类和Dao
```java
@Entity
public class User implements Serializable {
    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue
    private Long id;
    @Column(nullable = false, unique = true)
    private String userName;
    @Column(nullable = false)
    private String passWord;
    @Column(nullable = false, unique = true)
    private String email;
    @Column(nullable = true, unique = true)
    private String nickName;
    @Column(nullable = false)
    private String regTime;

    //省略getter settet方法、构造方法

}
```
dao只要继承JpaRepository类就可以，几乎可以不用写方法，还有一个特别的功能非常赞，就是根据方法名来自动生成SQL,比如`findByUserName`，会自动产生一个以`userName`为参数的查询方法，再比如`findAll`就会查询表里面的所有数据，再比如自动分页等等。

**Entity中不映射成列的字段得加@Transient注解，不加注解就会映射成列**
```java
public interface UserRepository extends JpaRepository<User,Long> {
    User findByUserName(String userName);
    User findByUserNameOrEmail(String userName,String email);
}
```

### 4. 测试
```java
@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest
public class UserRepositoryTests {
    @Autowired
    private UserRepository userRepository;

    @Test
    public void test() throws Exception {
        Date date = new Date();
        DateFormat dateFormat = DateFormat.getDateTimeInstance(DateFormat.LONG, DateFormat.LONG);
        String formattedDate = dateFormat.format(date);

        userRepository.save(new User("aa1", "aa@gmail.com", "aa", "aa123456", formattedDate));
        userRepository.save(new User("bb1", "bb@gmail.com", "bb", "bb123456", formattedDate));
        userRepository.save(new User("cc1", "cc@gmail.com", "cc", "cc123456", formattedDate));

        Assert.assertEquals(3,userRepository.findAll().size());
        Assert.assertEquals("bb",userRepository.findByUserNameOrEmail("bb","bb@gmail.com").getNickName());
        userRepository.delete(userRepository.findByUserName("aa1"));
    }
}
```
当然spring data jpa还有很多功能，比如封装好的分页，可以自定义SQL，主从分离等等，等到以后再做细讲。

## Thymeleaf模板
Spring Boot推荐使用thymeleaf模板来代替jpa,那么thymeleaf模板到底好在哪里呢，让Spring官方来推荐，下面我们来看看
### 介绍
Thymeleaf是一款用于渲染XML/XHTML/HTML5内容的模板引擎。类似JSP，Velocity，FreeMarker等，它也可以轻易的与Spring MVC等Web框架进行集成作为Web应用的模板引擎。与其它模板引擎相比，**Thymeleaf最大的特点是能够直接在浏览器中打开并正确显示模板页面，而不需要启动整个Web应用**。

好了，你们可能会觉得已经习惯使用了velocity,freemarker,beetle之类的模板，那么thymeleaf到底好在哪呢？让我们来做个对比：
Thymeleaf是与众不同的，因为它使用了自然的模板技术。这意味着Thymeleaf的模板语法并不会破坏文档的结构，模板依旧是有效的XML文档。模板还可以用作工作原型，Thymeleaf会在运行期替换掉静态值。Velocity与FreeMarker则是连续的文本处理器。

下面的代码示例分别使用Velocity、FreeMarker与Thymeleaf打印出一条消息：
```html
Velocity: <p>$message</p>
FreeMarker: <p>${message}</p>
Thymeleaf: <p th:text="${message}">Hello World!</p>
```
**注意，由于Thymeleaf使用了XML DOM解析器，因此它并不适合处理大规模的XML文件。**

### 简单用法
**URL**

URL在Web应用模板中占据着十分重要的地位，需要特别注意 的是Thymeleaf对于URL的处理是通过语法@{...}来处理的。Thymeleaf支持绝对路径URL:
```html
<a th:href="@{https://www.baidu.com}">百度</a>
```

**条件求值**
```html
<a th:href="@{/login}" th:unless="${session.user != null}">登录</a>
```

**for循环**
```html
<tr th:each="prod : ${prods}">
    <td th:text="${prod.getName()}">Onions</td>
    <td th:text="${prod.getPrice()}">2.41</td>
    <td th:text="${prod.isInStock} ? #{true} : #{false}">yes</td>
</tr>
```
暂时就列这几个

### 页面即原型
在Web开发过程中一个绕不开的话题就是前端工程师与后端工程师的协作，在传统Java Web开发过程中，前端工程师和后端工程师一样，也需要安装一套完整的开发环境，然后各类Java IDE中修改模板、静态资源文件，启动/重启/重新加载应用服务器，刷新页面查看最终效果。

但实际上前端工程师的职责更多应该关注于页面本身而非后端，使用JSP，Velocity等传统的Java模板引擎很难做到这一点，因为它们必须在应用服务器中渲染完成后才能在浏览器中看到结果，而Thymeleaf从根本上颠覆了这一过程，通过属性进行模板渲染不会引入任何新的浏览器不能识别的标签，例如JSP中的，不会在Tag内部写表达式。整个页面直接作为HTML文件用浏览器打开，几乎就可以看到最终的效果，这大大解放了前端工程师的生产力，它们的最终交付物就是纯的HTML/CSS/JavaScript文件。

## WebJars
WebJars是一个很神奇的东西，可以让我们以jar包的形式来使用前端的各种框架和组件。
### 什么是Webjars
什么是WebJars？WebJars是将客户端（浏览器）资源（JavaScript，Css等）打成jar包文件，以对资源进行统一依赖管理。WebJars的jar包部署在Maven中央仓库上。
### 为什么使用
我们在开发Java web项目的时候会使用像Maven，Gradle等构建工具以实现对jar包版本依赖管理，以及项目的自动化管理，但是对于JavaScript，Css等前端资源包，我们只能采用拷贝到webapp下的方式，这样做就无法对这些资源进行依赖管理。那么WebJars就提供给我们这些前端资源的jar包形势，我们就可以进行依赖管理。
### 怎样使用
1. [WebJars官网](https://www.webjars.org/)查找对应的组件，比如Bootstrap.js
```xml
<dependency>
    <groupId>org.webjars.bower</groupId>
    <artifactId>bootstrap</artifactId>
    <version>3.3.6</version>
</dependency>
```
2. 在页面引入
```html
<link th:href="@{/webjars/bootstrap/3.3.6/dist/css/bootstrap.css}" rel="stylesheet"></link>
```

就可以正常使用了。



