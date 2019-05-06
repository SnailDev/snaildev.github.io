---
title: SpringBoot实战（三）Redis
author: SnailDev
tags:
  - SpringBoot
  - Redis
categories:
  - SpringBoot
date: 2018-09-03 20:32:28
featured_image: /images/spring-springboot-1.jpg
---
![spring-springboot-redis](/images/spring-springboot-1.jpg)

Spring Boot 对常用的数据库支持外，对nosql数据库也进行了封装自动化，
<!--more-->

## Redis介绍
Redis是目前业界使用最广泛的内存数据存储。相比Memcached，Redis支持更丰富的数据结构，例如hashes,lists,sets等，同时支持数据的持久化。除此之外，Redis还提供一些类数据库的特性，比如事务，HA，主从库等。可以说Redis兼具了缓存系统和数据库的一些特性，因此有着丰富的应用场景。本文介绍Redis在Spring Boot中两个典型的应用场景。

## 如何使用
1. 引入spring-boot-starter-data-redis
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

2. 添加redis配置
```
#Redis数据库索引（默认为0）
spring.redis.database=0
#Redis服务器地址
spring.redis.host=127.0.0.1
#Redis服务器连接端口
spring.redis.port=6379
#Redis服务器连接密码（默认为空）
spring.redis.password=
#Redis连接池最大连接数（使用负值表示没有限制）
spring.redis.pool.max-active=8
#Redis连接池最大阻塞等待时间（使用负值表示没有限制）
spring.redis.pool.max-wait=-1
#Redis连接池中的最大空闲连接
spring.redis.pool.max-idle=8
#Redis连接池中的最小空闲连接
spring.redis.pool.min-idle=0
#Redis连接超时时间（毫秒）
spring.redis.timeout=0
```

3. 添加cache的配置类
```java
@Configuration
@EnableCaching
public class RedisConfig extends CachingConfigurerSupport {

    @Bean
    @Override
    public KeyGenerator keyGenerator() {
        return new KeyGenerator() {
            @Override
            public Object generate(Object o, Method method, Object... objects) {
                StringBuilder sb = new StringBuilder();
                sb.append(o.getClass().getName());
                sb.append(method.getName());
                for (Object obj : objects) {
                    sb.append(obj.toString());
                }
                return sb.toString();
            }
        };
    }

    @Bean
    @SuppressWarnings("rawtypes")
    public CacheManager cacheManager(RedisTemplate redisTemplate) {
        RedisCacheManager rcm = new RedisCacheManager(redisTemplate);
        // 设置缓存过期时间
        // rcm.setDefaultExpiration(60); //秒

        return rcm;
    }

    @Bean
    public RedisTemplate<String, String> redisTemplate(RedisConnectionFactory factory) {
        StringRedisTemplate template = new StringRedisTemplate(factory);
        Jackson2JsonRedisSerializer jackson2JsonRedisSerializer = new Jackson2JsonRedisSerializer(Object.class);
        ObjectMapper om = new ObjectMapper();
        om.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
        om.enableDefaultTyping(ObjectMapper.DefaultTyping.NON_FINAL);
        jackson2JsonRedisSerializer.setObjectMapper(om);
        template.setValueSerializer(jackson2JsonRedisSerializer);
        template.afterPropertiesSet();

        return template;
    }
}
```

4. 好了，接下来我们就可以直接使用了
```java
@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest
public class RedisTests {
    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    @Autowired
    private RedisTemplate redisTemplate;

    @Test
    public void test() throws Exception {
        stringRedisTemplate.opsForValue().set("aaa", "111");
        Assert.assertEquals("111", stringRedisTemplate.opsForValue().get("aaa"));
    }

    @Test
    public void testObj() throws Exception {
        User user = new User("aa@gmail.com", "aa", "aa123456");
        ValueOperations<String, User> operations = redisTemplate.opsForValue();
        operations.set("com.example", user);
        operations.set("com.example.timeout", user, 1, TimeUnit.SECONDS);
        Thread.sleep(1000);

        boolean exists = redisTemplate.hasKey("com.example.timeout");
        if (exists) {
            System.out.println("exists is true");
        } else {
            System.out.println("exists is false");
        }
    }
}
```
以上都是手动使用的方式，如何在查找数据库的时候自动使用缓存呢，看下面：

5. 自动根据方法生成缓存
```java
@RestController
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/getUser")
    @Cacheable(value="user-key")
    public User getUser(){
        User user = userRepository.findUserByUserName("bb1");
        System.out.println("若下面没出现“无缓存的时候调用”字样且能打印出数据表示测试成功");

        return user;
    }
}
```
其中value的值就是就是缓存到redis中的key。

## 共享Session 
spring boot 整合 spring-session-data-redis
分布式系统中，session共享有很多的解决方案，其中托管到缓存中应该是最常用的方案之一。

### Spring Session官方说明
Spring Session provides an API and implementations for managing a user's session information.

### 如何使用
1. 引入依赖
```xml
<!--当@EnableRedisHttpSession注解找不到时引入-->
<!--<dependency>-->
    <!--<groupId>org.springframework.session</groupId>-->
    <!--<artifactId>spring-session</artifactId>-->
    <!--<version>1.3.3.RELEASE</version>-->
<!--</dependency>-->

<dependency>
    <groupId>org.springframework.session</groupId>
    <artifactId>spring-session-data-redis</artifactId>
</dependency>
```

2. Session配置
```java
@Configuration
@EnableRedisHttpSession(maxInactiveIntervalInSeconds = 86400*30)
public class SessionConfig {

}
```
> maxInactiveIntervalInSeconds: 设置Session失效时间。
> 使用Redis Session之后，原Boot的server.session.timeout属性不再生效

好了，这样就配置完成了，让我们来测试下

3. 测试
添加测试方法获取sessionId
```java
@GetMapping("/uid")
public String uid(HttpSession session) {
    UUID uid = (UUID) session.getAttribute("uid");
    if (uid == null) {
        uid = UUID.randomUUID();
    }
    session.setAttribute("uid", uid);
    return session.getId();
}
```
登录redis输入`keys '*session*'`进行查询
```
127.0.0.1:6379> keys '*session*'
1) "spring:session:sessions:expires:21099c0b-ae12-4ebc-ac8f-7d2f9baf5cdf"
2) "spring:session:expirations:1541400420000"
3) "spring:session:sessions:21099c0b-ae12-4ebc-ac8f-7d2f9baf5cdf"
```
其中 1541400420000为失效时间，意思是这个时间后session失效，`21099c0b-ae12-4ebc-ac8f-7d2f9baf5cdf` 为sessionId,登录http://localhost:8080/uid 发现会一致，就说明session 已经在redis里面进行有效的管理了。

### 如何在两台或者多台服务器中共享session
其实就是按照上面的步骤在另一个项目中再次配置一次，启动后就自动进行了session共享。




