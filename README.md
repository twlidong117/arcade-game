
前端纳米学位街机游戏克隆项目
===============================

学生应该用这个[评审标准](https://review.udacity.com/#!/rubrics/499/view))来自我检查自己提交的代码。 确认自己写的函数要是**面向对象的** -  要么是类函数（就像函数 Player 和 Enemy）要么是类的原型链上的函数比如 Enemy.prototype.checkCollisions ， 在类函数里面或者类的原型链函数里面适当的使用关键词 'this' 来引用调用该函数的对象实例。最后保证你的**readme.md**文件要写明关于如何运行和如何玩你的街机游戏的指引。

关于如何开始这个项目的更详细的指导，可以查阅这份[指南](https://gdgdocs.org/document/d/1v01aScPjSWCCWQLIpFqvg3-vXLH2e8_SZQKC8jNO0Dc/pub?embedded=true)。


游戏玩法
=========

1. 页面加载完毕立即开始
2. 玩家通过方向键控制人物移动，每次移动一格
3. 胜利条件：玩家控制人物避开虫子并到达水面为胜利
4. 通过收集三种颜色的宝石获得奖励分，蓝色宝石1分，绿色宝石2分，橙色宝石3分
5. 奖励分收集方法：移动人物到达宝石所在的方格
6. 游戏结束时显示胜利或失败信息和玩家获得的奖励分数，按回车键重新开始