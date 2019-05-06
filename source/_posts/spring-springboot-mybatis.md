---
title: SpringBoot实战（六）Mybatis
author: SnailDev
tags:
  - SpringBoot
  - Mybatis
categories:
  - SpringBoot
date: 2018-09-06 21:13:28
featured_image: /images/spring-springboot-1.jpg
---
![spring-springboot-thymeleaf](/images/spring-springboot-1.jpg)

ORM框架的本质就是简化编程中操作数据库的编码，发展到现在基本上就剩两家了，一个是宣称可以不用写一句SQL的hibernate，一个是可以灵活调试动态sql的mybatis，两者各有特点，在企业级系统开发中可以根据需求灵活使用。发现一个有趣的现象：传统企业大都喜欢使用hibernate，互联网行业通常使用mybatis。
<!--more-->

Hibernate特点就是所有的sql都用Java代码来生成，不用跳出程序去写（看）sql，有着编程的完整性，发展到最顶端就是spring data jpa这种模式了，基本上根据方法名就可以生成对应的sql了。

Mybatis初期使用比较麻烦，需要各种配置文件、实体类、dao层映射关联、还有一大堆其他配置。当然mybatis也发现了这种弊端，初期开发了[generator](https://github.com/mybatis/generator)可以根据表结果自动生成实体类、配置文件和dao层代码，可以减轻一部分开发量；后期也进行了大量的优化可以使用注解，自动管理dao层和配置文件等，发展到最顶端就是今天讲的这种模式，mybatis-spring-boot-starter就是springboot+mybatis可以完全注解不用配置文件，也可以简单配置轻松上手。

## mybatis-spring-boot-starter
官方说明：MyBatis Spring-Boot-Starter will help you use MyBatis with Spring Boot

其实就是MyBatis看spring boot这么火热也开发出一套解决方案来凑凑热闹，但这一凑却是解决了很多问题，使用起来也却是顺畅了很多。mybatis-spring-boot-starter主要有两种解决方案，一种是使用注解解决一切问题，一种是简化后的老传统。

当然，任何模式都需要在pom文件中首先引入mybatis-spring-boot-starter的依赖。
```xml
<dependency>
  <groupId>org.mybatis.spring.boot</groupId>
  <artifactId>mybatis-spring-boot-starter</artifactId>
</dependency>
```
好了，现在分别介绍两种开发模式

### 无配置文件注解版
就是一切使用注解搞定。

#### 1. 添加相关maven依赖
```xml
	<dependencies>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter</artifactId>
		</dependency>

		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-test</artifactId>
			<scope>test</scope>
		</dependency>

		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-web</artifactId>
		</dependency>

		<dependency>
			<groupId>mysql</groupId>
			<artifactId>mysql-connector-java</artifactId>
		</dependency>

		<dependency>
			<groupId>org.mybatis.spring.boot</groupId>
			<artifactId>mybatis-spring-boot-starter</artifactId>
		</dependency>
	</dependencies>
```

#### 2. application.properties 添加相关配置
```
mybatis.type-aliases-package=com.example.springbootmybatis.entity

spring.datasource.driver-class-name=com.mysql.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/test1?useUnicode=true&characterEncoding=utf-8
spring.datasource.username=root
spring.datasource.password=123456
```
spring boot 会自动加载spring.datasource.*相关配置，数据源就会自动注入到sqlSessionFactory中，sqlSessionFactory会自动注入到Mapper中，对了你一切都不用管了，直接拿起来用就可以了。

在启动类中添加对Mapper包扫描@MapperScan
```java
@SpringBootApplication
@MapperScan()
public class SpringBootMybatisApplication {

	public static void main(String[] args) {
		SpringApplication.run(SpringBootMybatisApplication.class, args);
	}
}
```
或者直接在Mapper类上面添加注解`@Mapper`,建议使用上面这种，不然每个Mapper都加个注解也挺麻烦的。

#### 3. 开发Mapper
第三步是关键的一步，所有的sql生成都在这里
```java
public interface UserMapper {
    @Select("SELECT * FROM users")
    @Results({
            @Result(property = "userSex", column = "user_sex", javaType = UserSexEnum.class),
            @Result(property = "nickName", column = "nick_name")
    })
    List<UserEntity> getAll();

    @Select("SELECT * FROM users WHERE id = #{id}")
    @Results({
            @Result(property = "userSex", column = "user_sex", javaType = UserSexEnum.class),
            @Result(property = "nickName", column = "nick_name")
    })
    UserEntity getOne(Long id);

    @Insert("INSERT INTO users(userName,passWord,user_sex) VALUES(#{userName},#{passWord},#{userSex})")
    void insert(UserEntity user);

    @Update("UPDATE users SET userName=#{userName},nick_name=#{nickName} WHERE id=#{id}")
    void update(UserEntity user);

    @Delete("DELETE FROM user WHERE id = #{id}")
    void delete(Long id);
}
```
为了更接近生产特地将user_sex,nick_name两个属性在数据库中加了下划线和实体类属性名不一致，另外user_sex使用了枚举
> - @Select 是查询类的注解，所有的查询均使用这个；
> - @Result 修饰返回的结果集，关联实体类属性和数据库字段一一对应，如果实体类属性和数据库属性名保持一致，就不需要这个属性来修饰；
> - @Insert 插入数据库使用，直接传入实体类会自动解析属性到对应的值；
> - @Update 负责修改，也可以直接传入对象
> - @Delete 负责删除
[了解更多属性参考这里](http://www.mybatis.org/mybatis-3/zh/java-api.html)

> **注意，使用#符号和$符号的不同**
```java
// This example creates a prepared statement, something like select * from teacher where name = ?;
@Select("Select * from teacher where name = #{name}")
Teacher selectTeachForGivenName(@Param("name") String name);

// This example creates n inlined statement, something like select * from teacher where name = 'someName';
@Select("Select * from teacher where name = '${name}'")
Teacher selectTeachForGivenName(@Param("name") String name);
```

#### 4. 使用
上面三步就基本完成了相关的dao层开发，使用的时候当作普通的类注入就可以了
```java
@RunWith(SpringRunner.class)
@SpringBootTest
public class UserMapperTest {
    @Autowired
    private UserMapper userMapper;

    @Test
    public void testInsert() throws Exception {
        userMapper.insert(new UserEntity("aa", "a123456", UserSexEnum.MAN));
        userMapper.insert(new UserEntity("bb", "b123456", UserSexEnum.WOMAN));
        userMapper.insert(new UserEntity("cc", "b123456", UserSexEnum.WOMAN));

        Assert.assertEquals(3, userMapper.getAll().size());
    }

    @Test
    public void testQuery() throws Exception {
        List<UserEntity> users = userMapper.getAll();
        System.out.println(users.toString());
    }

    @Test
    public void testUpdate() throws Exception {
        UserEntity user = userMapper.getOne(new Long(30));
        System.out.println(user.toString());
        user.setNickName("snaildev");
        userMapper.update(user);
        Assert.assertTrue("snaildev".equals(userMapper.getOne(new Long(30)).getNickName()));
    }
}
```

### 极简xml版本
极简xml版本保持映射文件的老传统，优点主要体现在不需要实现dao的是实现层，系统会自动根据方法名在映射文件中找到对应的sql。

#### 1. 配置
pom文件和上面第一种方式一致，只是application.properties新增以下配置
```
mybatis.config-location=classpath:mybatis/mybatis-config.xml
mybatis.mapper-locations=classpath:mybatis/mapper/*.xml
```
指定了mybatis基础配置文件和实体类映射文件的地址

mybatis-config.xml配置
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration PUBLIC "-//mybatis.org//DTD Config 3.0//EN" "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <typeAliases>
        <typeAlias alias="Integer" type="java.lang.Integer" />
        <typeAlias alias="Long" type="java.lang.Long" />
        <typeAlias alias="HashMap" type="java.util.HashMap" />
        <typeAlias alias="LinkedHashMap" type="java.util.LinkedHashMap" />
        <typeAlias alias="ArrayList" type="java.util.ArrayList" />
        <typeAlias alias="LinkedList" type="java.util.LinkedList" />
    </typeAliases>
</configuration>
```
这里也可以添加一些mybatis基础的设置

#### 2. 添加User的映射文件
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd" >
<mapper namespace="com.example.springbootmybatis.mapper.UserMapper" >
    <resultMap id="BaseResultMap" type="com.example.springbootmybatis.entity.UserEntity" >
        <id column="id" property="id" jdbcType="BIGINT" />
        <result column="userName" property="userName" jdbcType="VARCHAR" />
        <result column="passWord" property="passWord" jdbcType="VARCHAR" />
        <result column="user_sex" property="userSex" javaType="com.example.springbootmybatis.enums.UserSexEnum"/>
        <result column="nick_name" property="nickName" jdbcType="VARCHAR" />
    </resultMap>

    <sql id="Base_Column_List" >
        id, userName, passWord, user_sex, nick_name
    </sql>

    <select id="getAll" resultMap="BaseResultMap"  >
        SELECT
        <include refid="Base_Column_List" />
        FROM users
    </select>

    <select id="getOne" parameterType="java.lang.Long" resultMap="BaseResultMap" >
        SELECT
        <include refid="Base_Column_List" />
        FROM users
        WHERE id = #{id}
    </select>

    <insert id="insert" parameterType="com.example.springbootmybatis.entity.UserEntity" >
       INSERT INTO
       		users
       		(userName,passWord,user_sex)
       	VALUES
       		(#{userName}, #{passWord}, #{userSex})
    </insert>

    <update id="update" parameterType="com.example.springbootmybatis.entity.UserEntity" >
        UPDATE
        users
        SET
        <if test="userName != null">userName = #{userName},</if>
        <if test="passWord != null">passWord = #{passWord},</if>
        nick_name = #{nickName}
        WHERE
        id = #{id}
    </update>

    <delete id="delete" parameterType="java.lang.Long" >
       DELETE FROM
       		 users
       WHERE
       		 id =#{id}
    </delete>

</mapper>
```
其实就是把上个版本中Mapper的sql搬到了这里的xml中了

#### 3. 编写Dao层的代码
```java
public interface UserMapper {
//    @Select("SELECT * FROM users")
//    @Results({
//            @Result(property = "userSex", column = "user_sex", javaType = UserSexEnum.class),
//            @Result(property = "nickName", column = "nick_name")
//    })
    List<UserEntity> getAll();

//    @Select("SELECT * FROM users WHERE id = #{id}")
//    @Results({
//            @Result(property = "userSex", column = "user_sex", javaType = UserSexEnum.class),
//            @Result(property = "nickName", column = "nick_name")
//    })
    UserEntity getOne(Long id);

//    @Insert("INSERT INTO users(userName,passWord,user_sex) VALUES(#{userName},#{passWord},#{userSex})")
    void insert(UserEntity user);

//    @Update("UPDATE users SET userName=#{userName},nick_name=#{nickName} WHERE id=#{id}")
    void update(UserEntity user);

//    @Delete("DELETE FROM user WHERE id = #{id}")
    void delete(Long id);
}
```
对比上一种方式，这里只剩接口方法

#### 4. 使用
使用方式和第一种方式没什么区别，可以参考第一种代码实现。

### 如何选择
两种模式各有特点，注解版适合简单快速的模式，其实像现在流行的微服务模式，一个微服务就会对应一个自己的数据库，多表连接查询的需求会大大的降低，会越来越适合这种模式了。

老传统模式即xml配置文件的方式，更适合大型项目，可以灵活的动态生成SQL，方便调整SQL，也有痛痛快快，洋洋洒洒的写SQL的感觉。

