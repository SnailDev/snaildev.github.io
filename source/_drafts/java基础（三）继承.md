---
title: java基础（三）继承
author: SnailDev
tags:
  - Java基础
categories:
  - Java基础
date: 2018-06-03 20:54:28
featured_image: /images/inheritance_1.png
---
![inheritance](/images/inheritance_1.png)

上篇随笔我们聊完封装， 知道封装是private + getter and setter, 其目的是为了安全， 也是为了更易于维护，模块化操作。

这篇我们继续聊聊面向对象三大特性中的继承，在《Think in java》中有这样一句话：

> 复用代码是Java众多引人注目的功能之一

但要成为极具革命性的语言，仅仅能够复用代码并加以改变是不够的，它还必须做更多的事情。在这句话中最引人注目的是“复用代码”，尽可能的复用代码是我们程序员一直在追求的，而继承也是面向对象思想中实现复用的重要手段。

我们先看一段代码：
```java
public class Man {
  private String name;
  private String sex;
  private int age;
  private Woman wife;

  // getter and setter
}

public class Woman {
  private String name;
  private int age;
  private String sex;
  private Man husband;

  // getter and setter
}
```
这里我们可以看出，Man、Woman两个类除了各自的wife、husband外其余部分全部相同，作为一个想最大限度实现复用代码的我们是不能忍受这样重复代码，那么利用继承吧。

首先让我们先离开软件编程的世界，从生活中我们知道男人、女人都是人，而且都有一些共性，比如名字，年龄，性别等等，而且他们能够吃东西、走路、说话等共同的行为，所以我们从这些特征可以发现并抽象出人的属性和行为。**使用继承我们可以使用已存在的类的定义作为基础建立新类，新类的定义可以增加新的数据或新的功能，也可以使用父类的功能，但不能选择性继承。**

修改代码如下：
```java
public class Person {
  private String name;
  private int age;
  private String sex;

  // getter and setter
}

public class Man extends Person {
  private Woman wife;

  // getter and setter
}

public class Woman extends Person {
  private Man husband;

  // getter and setter
}
```

对于Man、Woman使用继承后，除了代码量的减少我们还能够明显看到他们的关系。

继承所描述的是“is-a”的关系，如果有两个对象A和B,若可以描述为“A是B”，则可以表示A继承B，其中B是被继承者称之为父类或者超类，A是继承者称之为子类或者派生类。实际上，继承者是被继承者的特殊化，它除了拥有被继承者的特性外，还拥有自己独有的特性。例如


