---
title: java基础（二）封装
author: SnailDev
tags:
  - Java基础
categories:
  - Java基础
date: 2018-06-02 21:42:56
featured_image: /images/encapsulation_2.png
---
![encapsulation](/images/encapsulation_2.png)

对于面向对象的特点，想必大家应该都可以倒背如流：封装，继承，多态。但很多人对这些特点的理解仅仅停留在表面，认为封装就是变量的私有化，然后对外开放接口，获取和设置值，而不知道为什么要这样做。

封装，简单来说就是将变量私有化，在java里的用的就是private修饰符修饰，这样在外部产生的对象就不能直接访问这个变量。想要外部对象对变量进行访问或操作，就需要在类里面提供外部访问的接口，也就是我们熟知的get和set方法。

以上就是大部分人对于封装的理解。知道有封装这回事，知道怎么用，却不知道为什么要用，甚至觉得多此一举。因为明明person.name就是访问到变量，为什么非要person.getName()呢？
<!-- more -->

# 1. 任性的使用public
让我们先来看一下不使用封装的情况：

设计了3个类，人、男人、女人

```java
public class Person{
  public String name;
  public int age;

  // 省略get和set方法
}

public class Man extends Person{
  public double money;
  public Woman wife;
  
  // 省略get和set方法

  public void marry(Woman woman){
    this.wife = woman;
    woman.marry(this);
  }
}

public class Woman extends Person{
  public Man husband;

  // 省略get和set方法

  public void marry(Man man){
    this.husband = man;
  }
}

public class Test{
  public static void main(String[] args){
    Man man = new Man();
    man.name = "snail";
    man.age = 30;
    man.money = 10000;

    Woman woman = new Woman();
    woman.name = "lucy";
    
    man.marry(woman);

    System.out.println(man.name + "的妻子" + man.wife.name); //snail的妻子：lucy
    System.out.println(man.name + "的钱：" + man.money); //snail的钱：10000.0
  }
}
```
到这里一切正常，看起来也还不错。

但是这这个时候来了一个小偷，这个小偷呢，除了偷别人的钱和老婆啥都不干。
```java
public class Thief extends Man{
  private double stealMoney = 0;
  private List<Woman> women = new ArrayList<Woman>();

  //偷钱
  public void stealMoney(Man man){
    stealMoney += man.money;
    man.money = 0;
    
    System.out.println("哈哈，偷到钱了...");
  }

  //偷老婆
  public void stealWife(Man man){
    man.wife.husband = this;
    women.add(man.wife);
    
    Woman woman = new Woman();
    woman.name = "凤姐";
    man.wife = woman;

    System.out.println("哈哈哈，又偷了一个妹子做老婆...");
  }
}

public class Test{
  public static void main(String[] args){
    Man man = new Man();
    man.name = "snail";
    man.age = 30;
    man.money = 10000;

    Woman woman = new Woman();
    woman.name = "lucy";
    
    man.marry(woman);

    //来了一个小偷
    Thief thief = new Thief();
    thief.stealMoney(man);
    thief.stealWife(man);

    System.out.println(man.name + "的妻子" + man.wife.name); //snail的妻子：凤姐
    System.out.println(man.name + "的钱：" + man.money); //snail的钱：0.0
  }
}
```
现在傻眼了，钱和老婆都成别人的了，自己还莫名其妙的和凤姐结了婚...

这时，你觉得是时候改变一下了！！！
# 2. 封装来报到
封装觉得你有点惨，于是过来帮助你一下：
```java
public class PackagePerson{
  private String name;
  private int age;

  // 省略get和set方法
}

public class PackageMan extends PackagePerson{
  private PackageWoman wife;
  private double money;

  public PackageMan(String name, double money){
    this.setName(name);
    this.money = money;
  }

  public void marry(PackageWoman woman){
    this.wife = woman;
    woman.marry(this);
  }

  public PackageWoman getWife(){
    return wife;
  }

  public double getMoney(){
    return money;
  }
}

public class PackageWoman extends PackagePerson{
  private PackageMan husband;

  public PackageWoman(String name){
    this.setName(name);
  }

  public void marry(PackageMan man){
    this.husband = husband;
  }

  public PackageMan getHusband(){
    return husband;
  }
}

public class TestPackage{
  public static void main(String[] args){
    PackageMan man = new PackageMan("snail", 10000);
    PackageWoman woman = new PackageWoman("lucy");
    
    man.marry(woman);

    System.out.println(man.getName() + "的妻子" + man.getWife().getName()); //snail的妻子：lucy
    System.out.println(man.getName() + "的钱：" + man.getMoney()); //snail的钱：10000.0
  }
}
```

上面的代码看起来除了长了点，没什么其他问题。这时候小偷已经不能偷我们的钱和老婆了，钱和老婆都被保护了起来，以至于我们自己想设置和更换都不行了，这明显不太科学...

# 3. 封装厉害的地方
如何解决上面的问题呢？私有化外部访问不到，自己也没法改数据，提供了set方法又会让所有人都能改，和不私有设计没什么区别，好纠结。

Wait，这里说的“所有人”真的是所有人吗？

让我们来看看：
```java
public void setMoney(PackageMan man, double money){
  if(man == this){
    this.money = money;
  }else{
    System.out.println("喂，110吗？" + man.getName() + " 抢钱！");
  }
}

public class TestPackage{
  public static void main(String[] args){
    PackageMan man = new PackageMan("snail", 10000);
    PackageMan man1 = new PackageMan("thief", 10000);

    man.setMoney(man, 20000);
    System.out.println(man.getName() + "的钱：" + man.getMoney()); //snail的钱：20000.0

    man.setMoney(man1, 0); //喂，110吗？thief 抢钱！
  }
}
```

这样就只有自己可以修改了，别人不可以。

但是你老婆不满意了，凭什么只有你自己可以改？我也想改！

这种需求还是应该满足一下的，怎么做呢？
```java
public void setMoney(Object obj, double money){
  if(obj == this || obj == this.wife){
    this.money = money;
  }else{
    System.out.println("喂，110吗？有人抢钱！");
  }
}
```

# 4. 总结一下
以上就是对面向对象中的封装的理解，封装不仅仅只是 private + getter and setter。使用封装可以对setter进行更深层次的定制，我们可以对可以执行的setter方法的对象做规定，也可以对数据操作要求，还可以做类型转换等一系列可以想到的。

使用封装不仅仅是安全，更可以简化操作。不要觉得用了封装多了好多代码，看起来乱糟糟的。如果你写一个大系统，一开始你可能这样定义属性的
```java
public int age;
```
你的程序里大概有100处这样的语句：
```java
p.age = 10;
```
这个时候，突然有需求要求把数据类型变了，改成：
```java
public String age;
```
那么重构代码是不是要把那100处数据都加个双引号呢？是不是特别麻烦？

但是如果用了封装，只需要这样：
```java
public void setAge(int age){
  this.age = String.valueOf(age);
}
```
是不是简化了操作？

这里只是举个栗子，实际开发中也不会出现改变数据类型这么操蛋的事...

封装还有一个好处就是模块化。当你参与一个很多人实现的大型系统中，不可能知道所有的类是怎样实现的。只需要知道这个类提供了哪些方法，需要传入什么数据，能得到什么样的结果。至于怎么得到的，关我X事？

所以说，如果你写的代码还没用封装，改过来吧。不仅仅因为大家都在用，而是这确实可以给我们提供很大的便利。
封装的有以下四大好处：
  1. 良好的封装能够减少耦合
  2. 类内部的结构可以自由修改
  3. 可以对成员进行更精确的控制
  4. 隐藏信息和实现细节