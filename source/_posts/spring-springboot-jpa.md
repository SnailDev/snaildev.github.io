---
title: SpringBoot实战（五）Jpa
author: SnailDev
tags:
  - SpringBoot
  - Jpa
categories:
  - SpringBoot
date: 2018-09-05 23:27:05
featured_image: /images/spring-springboot-1.jpg
---
![spring-springboot-thymeleaf](/images/spring-springboot-1.jpg)

JPA(Java Persistence API) 是Sun官方提出的Java持久化规范。它为Java开发人员提供了一种对象/关联映射工具来管理Java应用中的关系数据。它的出现主要是为了简化现有的持久化开发工作和整合ORM技术，结束现在Hibernate、TopLink、JDO等ORM框架各自为营的局面。值得注意的是，JPA是在充分吸收了现有Hibernate、TopLink、JDO等ORM框架的长处发展而来，具有易于使用，伸缩性强等特点。从目前的开发社区的反应上看，JPA受到了极大的支持和赞扬，其中就包括了Spring和EJB3.0的开发团队。

> JPA是一套规范，不是一套产品，而Hibernate、TopLink、JDO等是一套产品。
> 如果说这些产品实现了JPA规范，那么我们就可以叫它们为JPA的实现产品。

<!--more-->

## Spring Data JPA
Spring Data JPA 是 Spring 基于ORM框架、JPA规范的基础封装的一套JPA应用框架，可使开发者用极简的代码即可实现对数据的访问和操作。它提供了包括增删改查等在内的常用功能，且易于扩展！学习并使用Spring Data JPA可以极大提高开发效率！

> Spring Data JPA让我们解脱了DAO层的操作，基本上所有的CRUD都可以依赖于它来实现。

## 基本查询
基本查询也分两种，一种是spring data jpa默认实现，一种是根据查询的方法名来自动解析成SQL。

### 预先生成方法
spring data jpa 默认预先生成了一些基本的CURD的方法，例如：增、删、改等等

1. 继承JpaRepository
```java
public class UserRepository extends JpaRepository<User, Long> {

}
```

2. 使用默认方法, 顾名思义
```java
@AutoWired
private UserRepository userRepository;

@Test
public void testBaseOperation() throws Exception {
  User user = new User();
  userRepository.findAll();
  userRepository.findOne(11);
  userRepository.save(user);
  userRepository.delete(user);
  userRepository.count();
  userRepository.exists(11);
  
  //...
}
```

### 自定义简单查询
自定义的简单查询就是根据方法名来自动生成SQL，主要的语法是`findXXBy`,`readXXBy`,`queryXXBy`,`countXXBy`,`getXXBy`后面跟属性名称。
```java
User findByUserName(String userName);
```
也可以使用一些关键字`And`、`Or`
```java
User findByUserNameOrEmail(String userName, String email);
```
修改、删除、统计同样是类似语法
```java
void deleteById(Long id);
Long countByUserName(String userName);
```
基本上SQL体系中的关键词都可以使用，例如：`Like`、`IgnoreCase`、`OrderBy`
```java
List<User> findByEmailLike(String email);
User findByUserNameIgnoreCase(String userName);
List<User> findByUserNameOrderByEmailDesc(String email);
```
具体的关键字，使用方法和生成的SQL如下表所示

| Keyword | Sample | JPQL snippet |
|:------  |:------  |:------  |
| And | findByLastNameAndFirstName  | ... where x.lastname = ?1 and x.firstname = ?2 |
| Or  | findByLastNameOrFirstName | ... where x.lastname = ?1 or x.firstname = ?2 |
| Is<br>Equals  | findByFirstNameIs<br>findByFirstNameEquals  | ... where x.firstname = ?1 |
| Between | findByStartDateBetween  | ... where x.startdate between ?1 and ?2 |
| LessThan  | findByAgeLessThan | ... where x.age < ?1  |
| LessThanEqual | findByAgeLessThanEqual  | ... where x.age <= ?1 |
| GreaterThan | findByAgeGreaterThan  | ... where x.age > ?1  |
| GreaterThanEqual  | findByAgeGreaterThanEqual | ... where x.age >= ?1 |
| After | findByStartDateAfter  | ... where x.startdate > ?1  |
| Before  | findByStartDateBefore | ... where x.startdate < ?1  |
| IsNull  | findByAgeIsNull | ... where x.age is null |
| IsNotNull<br>NotNull | findByAge(Is)NotNull  | ... where x.age not null |
| Like  | findByFirstNameLike | ... where x.firstname like ?1 |
| NotLike | findByFirstNameNotLike  | ... where x.firstName not like ?1 |
| StartingWith  | findByFirstNameStartingWith | ... where x.firstname like ?1(parameter bound with appended %)  |
| EndingWith  | findByFirstNameEndingWith | ... where x.firstname like ?1(parameter bound with prepend %) |
| Containing  | findByFirstNameContaining | ... where x.firstname like ?1(parameter bound wrapped in %)
| OrderBy | findByAgeOrderByLastNameDesc  | ... where x.age = ?1 order by x.lastname desc |
| Not | findByLastNameNot | ... where x.lastname <> ?1  |
| In  | findAgeIn(Collection ages)  | ... where x.age in ?1 |
| NotIn | findAgeNotIn(Collection ages) | ... where x.age not in ?1 |
| True  | findByActiveTrue  | ... where x.active = true |
| False | findByActiveFalse | ... where x.active = false  |
| IgnoreCase  | findByFirstNameIgnoreCase | ... where UPPER(x.firstname) = UPPER(?1)  |

## 复杂查询
在实际开发中我们需要用到分页、删选、连表等查询的时候就需要特殊的方法或者自定义SQL
### 分页查询
分页查询在实际开发中已经非常普遍了，spring data jpa 已经帮我们实现了分页的功能，在查询方法中，需要传入参数`Pageable`,当查询中有多个参数时，`Pageable`建议做为最后一个参数传入
```java
Page<User> findAll(Pageable pageable);
Page<User> findByUserName(String userName, Pageable pageable);
```
`Pageable`是spring封装的分页实现类，使用的使用需要传入页码，每页条数和排序规则
```java
@AutoWired
private UserRepository userRepository;

@Test
public void testPageQuery() throws Exception {
  int pageIndex = 1, pageSize = 10;
  Sort sort = new Sort(Direction.DESC, "id");
  Pageable pageable = new PageRequest(pageIndex, pageSize, sort);
  userRepository.findAll(pageable);
  userRepository.findByUserName("test", pageable);
}
```

### Limit查询
```java
User findFirstByOrderByLastnameAsc();
User findTopByOrderByAgeDesc();
Page<User> queryFirst10ByLastname(String lastname, Pageable pageable);
List<User> findFirst10ByLastname(String lastname, Sort sort);
List<User> findTop10ByLastname(String lastname, Pageable pageable);
```

### 自定义SQL查询
其实spring data jpa绝大部分的SQL都可以根据方法名定义的方式来实现，但是由于某些原因我们想使用自定义的SQL来查询，spring data jpa也是完美支持的；在SQL的查询方法上面使用`@Query`注解，如涉及到删除和修改则需要加上`@Modifying`，也可以根据需要添加 `@Transactional` 对事务的支持，查询超时的设置等
```java
@Modifying
@Query("update User u set u.username = ?1 where u.id = ?2")
int modifyUserNameByUserId(String userName,Long id);

@Transactional
@Modifying
@Query("delete from User where id = ?1")
void deleteByUserId(Long id);

@Transactional(timeout = 10)
@Query("select u from User u where u.email = ?1")
User findByEmail(String email);
```

### 多表查询
多表查询在spring data jpa中有两种实现方式，第一种是利用hibernate的级联查询来实现，第二种是创建一个结果集接口来接收查询后的结果，这里主要是第二种方式。

首先需要定义一个结果集的接口类。
```java
public interface HotelSummary {
  City getCity();
  String getName();
  Double getAverageRating();

  default Integer getAverageRatingRounded() {
    return getAverageRating() == null ? null : (int) Math.round(getAverageRating());
  }
}
```
查询的方法返回类型设置为新创建的接口
```java
@Query("select h.city as city, h.name as name, avg(r.rating) as averageRating "
      - "from Hotel h left outer join h.reviews r where h.city = ?1 group by h")
Page<HotelSummary> findByCity(City city, Pageable pageable);

@Query("select h.name as name, avg(r.rating) as averageRating "
      - "from Hotel h left outer join h.reviews r group by h")
Page<HotelSummary> findByCity(Pageable pageable);
```
使用
```java
Page<HotemlSummary> hotels = hotelRepository.findByCity(new PageRequest(0, 10, Direction.ASC, "name"));
for(HotelSummary summary : hotels){
  System.out.println("Name " + summary.getName());
}
```
> 在运行中Spring会给接口（HotelSummary）自动生成一个代理类来接收返回结果，代码汇总使用`getXX()`的形式来获取

## 多数据源支持
### 同源数据库
日常项目中因为使用的是分布式开发模式，不同的服务有不同的数据源，常常需要在一个项目中使用多个数据源，因此需要配置spring data jpa 以适合对多数据源的使用，一般分以下三步：
1. 配置多数据源
2. 不同源的实体类放入不同包路径
3. 声明不同的包路径下使用不同的数据源、事务支持

可参考：[Spring Boot多数据源配置与使用](https://www.jianshu.com/p/34730e595a8c)

### 异构数据库
比如我们的项目中，即需要对mysql的支持，也需要对mongodb的支持等。

实体类声明`@Entity`关系型数据库支持类型、声明`@Document`为mongodb支持类型，不同的数据源使用不同的实体就可以了
```java
interface PersonRepository extends JpaRepository<Person, Long> {
  // ...
}

@Entity
public class Person {
  // ...
}

interface UserRepository extends MongoRepository<User, Long> {
  // ...
}

@Document
public class User {
  // ...
}
```
但是如果Person既使用mysql也使用mongodb呢，也可以做混合使用
```java
interface JpaPersonRepository extends JpaRepository<Person, Long> {
  // ...
}

interface MongoDBPersonRepository extends MongoRepository<Person, Long> {
  // ...
}

@Entity
@Document
public class Person {
  // ...
}
```
也可以通过对不同的包路径进行声明，比如A包路径下使用mysql，B包路径下使用mongoDB
```java
@EnableJpaRepository(basePackages = "com.example.repositories.jpa")
@EnableMongoRepository(basePackages = "com.example.repositories.mongo")
interface Configuration { }
```

## 其他
### 使用枚举
使用枚举的时候，我们希望数据库中存储的是枚举对应的String类型，而不是枚举的索引值，需要在属性上面添加`@Enumerated(EnumType.STRING)`注解
```java
@Enumerated(EnumType.STRING)
@Column(nullable = true)
private UserType type;
```

### 不需要和数据库映射的属性
正常情况下，我们在实体上加上注解`@Entity`，就会让实体类的属性和表的列相关联，如果其中某个属性不需要和数据库来进行关联，而只是展示的时候做计算，只需要加上`@Transient`属性即可。
```java
@Transient
private String userName;
```

## 参考
[Spring Data JPA 参考指南 中文版](https://ityouknow.gitbooks.io/spring-data-jpa-reference-documentation/content/)