---
title: 高性能js库Lodash
author: SnailDev
tags:
  - JavaScript
categories:
  - JavaScript
date: 2018-05-08 11:09:00
featured_image: /images/lodash_0.jpg
---
![timg](/images/lodash_0.jpg)


有几年开发经验的工程师，往往都会有自己的一套工具库，称为utils、helpers等等，这套库一方面是自己的技术积累，另一方面也是对某项技术的扩展，领先于技术规范的制订和实现。
Lodash就是这样的一套工具库，它内部封装了诸多对字符串、数组、对象等常见数据类型的处理函数，其中部分是目前ECMAScript尚未制订的规范，但同时被业界所认可的辅助函数。而且每天使用npm安装Lodash的数量在百万级以上，这在一定程度上证明了其代码的健壮性，值得我们在项目中一试。
<!-- more -->

## 1. 模块组成

- Lodash听得辅助函数主要分为以下几类，函数列表和用法实力请查看Lodash的官方文档：
- Array， 适合于数组类型，比如填充数据、查找元素、数组分片等操作
- Collocation， 适用于数组和对象类型，部分适用于字符串，比如分组、查找、过滤等操作
- Function， 适用于函数类型，比如节流、延迟、缓存、设置钩子等操作
- Lang， 普遍适用于各种类型，常用于执行类型判断和类型转换
- Math， 使用与数值类型，常用于执行数学运算
- Number， 适用于生成随机数，比较数值与数值区间的关系
- Object， 适用于对象类型，常用于对象的创建、扩展、类型转换、检索、集合等操作
- Seq， 常用于创建链式调用，提高执行性能（惰性计算）
- String， 适用于字符串类型
- lodash/fp 模块提供了更接近函数式编程的开发方法，其内部的函数经过包装，具有immutable、auto-curried、iteratee-first、data-last（官方介绍）等特点。
- Fixed Arity，固化参数个数，便于柯里化
- Rearragned Arguments， 重新调整参数位置，便于函数之间的聚合
- Capped Iteratee Argument， 封装Iteratee参数

## 1. 性能
在 Filip Zawada的文章[《How to Speed Up Lo-Dash ×100? Introducing Lazy Evaluation》](https://link.jianshu.com/?t=http://filimanjaro.com/blog/2014/introducing-lazy-evaluation/)中提到了Lodash提高执行速度的思路，主要有三点： Lazy Evaluation、Pipelining和Deferred Execution。下面两张图来自Filip的博客：

![976007-20180123132259975-836139498](/images/lodash_1.gif)

假设有如上图所示的问题： 从若干个求中取出三个面值小于10的球。第一步是从所有的求中取出所有面值小于10的球，第二部是从上一步的结果中去三个球。

![976007-20180123132320240-161059187](/images/lodash_2.gif)

上图是另一个解决方案，如果一个球能够通过第一步，那么就继续执行第二步，直至结束然后测试下一个球。。。当我们取到三个球之后就中断整个循环。Filip称这是Lazy Evaluation Algorithm， 就个人理解这并不全面，他后续提到的Pipelining（管道计算），再加上一个中断循环执行的算法应该更符合这里的图示。

此外，使用Lodash的链式调用时，只有现实或隐式调用 .value 方法才会对链式调用的整个操作进行取值，这种不在声明时立即求值，而在使用时进行求职的方式，是Lazy Evaluation最大的特点。

## 3. 九个实例
收益于Lodash的普及程度，使用它可以提高很多人开发时于都代码的效率，减少彼此之间的误解（Loss of Consciousness）。在[《Lodash: 10 Javascript Utility Functions That You Should Probably Stop Rewriting》](https://link.jianshu.com/?t=http://colintoh.com/blog/lodash-10-javascript-utility-functions-stop-rewriting)一文中，作者列举了多个常用的Lodash函数，实例演示了使用Lodash的技巧。

1. N次循环

```javascript
// 1. Basic for loop.
for(var i = 0; i < 5; i++){
    //...
}

// 2. Using Array's join and split methods
Array.apply(null, Array(5)).forEach(function(){
    //...
});

// Lodash
_.times(5, function(){
    //...
}); 
```
for 语句是执行虚幻的不二选择，Array.apply也可以模拟循环，但在上面代码的使用场景下，_.tiems()的解决方法更加简洁和易于理解。

2. 深层查找属性值
```javascript
// Fetch the name of the first pet from each owner
var ownerArr = [{
    "owner": "Colin",
    "pets": [{"name": "dog1"}, {"name": "dog2"}]
}, {
    "owner": "John",
    "pets": [{"name": "dog3"}, {"name": "dog4"}]
}];

// Array's map method.
ownerArr.map(function(owner){
    return owner.pets[0].name;
});

// Lodash
_.map(ownerArr, "pets[0].name");
```
_.map 方法是对原生 map 方法的改进，其中使用 pets[0].name 字符串对嵌套数据取值的方式简化了很多冗余的代码，非常类似使用jQuery选择DOM节点 ul>li>a , 对于前端开发者来说有种久违的亲切感。

3. 个性化数组
```javascript
// Array's map method.
Array.apply(null, Array(6)).map(function(item, index){
    return "ball_" + index; 
});

// Lodash
_.times(6, _.uniqueId.bind(null, 'ball_'));

// Lodash
_.times(6, _.partial(_.uniqueId, 'ball_'));
// eg. [ball_0, ball_1, ball_2, ball_3, ball_4, ball_6]
```
在上面的代码中，我们要创建一个初始值不同、长度为6的数组，其中 _.uniqueId 方法用于生成独一无二的标示符（递增的数字，在程序运行期间保持独一无二）， _.partial 方法是对 bind 的封装。

4. 深拷贝
```javascript
var objA = {
    "name": "colin"
}

// 常用的方法一般会比较长，循环对象等
// http://stackoverflow.com/questions/4459928/how-to-deep-clone-in-javascript

// Lodash
var objB = _.cloneDeep(objA);
objB === objA // false
```
JavaScript 没有直接提供深拷贝的函数，但是我们可以用其他杉树来模拟，比如 JSON.parse(JSON.stringify(objectToClone)), 但这种方法要求对象中的属性值不能是函数。Lodash 中的 _.cloneDeep 函数封装了深拷贝的逻辑，用起来更加简洁。

5. 随机数
```javascript
// Native utility method
function getRandomNumber(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

getRandomNumber(15, 20);

// Lodash
_.random(15, 20);
```
Lodash 的随机数生成函数更贴近实际开发，ECMAScript 的随机数生成函数式底层必备的接口，两者都不可获取。此外，使用 _.random(15, 20, true) 还可以在15到20之间生成随机的浮点数。

6. 对象扩展
```javascript
// Adding extend function to Object.prototype
Object.prototype.extend = function(obj) {
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            this[i] = obj[i];
        }
    }
};

var objA = {"name": "colin", "car": "suzuki"};
var objB = {"name": "james", "age": 17};

objA.extend(objB);
objA; // {"name": "james", "age": 17, "car": "suzuki"};

// Lodash
_.assign(objA, ojbB);
```
_.assign 是浅拷贝， 和ES6新增的 Object.assign 函数功能一致（建议优先使用Object.assign）。

7. 筛选属性
```javascript
// Native method: Remove an array of keys from object
Object.prototype.remove = function(arr) {
    var that = this;
    arr.forEach(function(key){
        delete(this[key]);
    });
};

var objA = {"name": "colin", "car": "suzuki", "age": 17};

objA.remove(['car', 'age']);
objA; // {"name": "colin"}

// Lodash
objA = _.omit(objA, ['car', 'age']);
// => {"name": "colin"}

objA = _.omit(objA, "car");
// => {"name": "colin", "age": 17}

objA = _.omit(objA, _.isNumber);
// => {"name": "colin", "car": "suzuki"};
```
大多数情况下，Lodash所提供的辅助函数都会比原声的函数更贴近开发需求。在上面的代码中，开发者可以使用数组、字符串以及函数的方式筛选对象的属性，并且最终会返回一个新的对象，中间执行筛选时不会对旧对象产生影响。
```javascript
// Native method: Returning a new object with selected properties
Object.prototype.pick = function(arr) {
    var _this = this;
    var obj = {};
    arr.forEach(function(){
        obj[key] = _this[key];
    });
    
    return obj;
};

var objA = {"name": "colin", "car": "suzuki", "age": 17};

var objB = objA.pick(['car', 'age']);
// => {"car": "suzuki", "age": 17}

// Lodash
var objB = _.pick(objA, ['car', 'age']);
// => {"car": "suzuki", "age":17}
```
_.pick 是 _.omit 的相反操作，用于从其他对象中挑选属性生成新的对象。

8. 随机元素
```javascript
var luckDraw = ["Colin", "John", "James", "Lily", "Mary"];

function pickRandomPerson(luckyDraw){
    var index = Math.floor(Math.random() * (luckyDraw.length - 1));
    return luckyDraw[index];
}

pickRandomPerson(luckyDraw); //John

// Lodash
_.sample(luckyDraw); // Colin

// Lodash - Getting 2 random item
_.sample(luckyDraw, 2); // ['John', 'Lily']
```
_.sample 支持随机挑选多个元素并返回新的数组。

9. 针对 JSON.parse 的错误处理
```javascript
// Using try-catch to handle the JSON.parse error
function parse(str){
    try {
        return JSON.parse(str);
    }
    
    catch(e) {
        return false;
    }
}

// With Lodash
function parseLodash(str){
    return _.attempt(JSON.parse.bind(null, str));
}

parse('a');
// => false
parseLodash('a');
// => Return an error object

parse('{"name": "colin"}');
// => Return {"name": "colin"}
parseLodash('{"name": "colin"}');
// => Return {"name": "colin"}
```
如果你在使用 JSON.parse 时没有预置错误处理，那么它很有可能会成为一个定时炸弹，我们不应该默认接收的JSON对象都是有效的。 try-catch 是常见的错误处理方式，如果项目中使用Lodash，那么可以使用 _.attmpt 替代 try-catch 的方式，当解析JSON出错时，该方法会返回一个 Error 对象。

> 随着ES6的普及，Lodash的功能或多或少会被原生功能所替代，所以使用时还需要进一步甄别，建议优先使用原生函数，有关ES6替代Lodash的部分，请参考文章[《10 个可用 ES6 替代的 Lodash 特性》](https://link.jianshu.com/?t=http://www.zcfy.cc/article/10-lodash-features-you-can-replace-with-es6-467.html)。

其中有两处分别值得一看：
```javascript
// 使用箭头函数创建可复用的路径
const object = { 'a': [{ 'b': { 'c': 3 } }, 4] };

[
    obj => obj.a[0].b.c,
    obj => ojb.a[1]
].map(path => path(object));

// 使用箭头函数编写链式调用
const pipe = function => data => {
    return functions.reduce(
        (value, func) => func(value),
        data
    );
};

const pipeline = pipe([
    x => x * 2,
    x => x / 3,
    x => x > 5,
    b => !b
]);

pipeline(5);
// true
pipeline(20);
// false
```
在ES6中，如果一个函数只接收一个形参且函数提示一个 return 语句， 就可以使用箭头函数简化为：
```javascript
const func = p => v;

// 类似于（不完全相同）
const func = function(p) {
    return v;
}
```
当有多重嵌套时，可以简化为：
```javascript
const func = a => b => c => a + b + c;
func(1)(2)(3);
// => 6

// 类似于
const func = function (a) {
    return function (b) {
        return function (c) {
            return a + b + c;
        }
    }
}
```