/**
 * Item类
 * 物体基类
 */
class Item {
    /**
     * Item构造函数
     * @constructor
     * @param {string} fp - 图像文件的相对地址 
     * @param {number} x - 初始位置的x坐标
     * @param {number} y - 初始位置的y坐标
     */
    constructor(fp, x, y) {
        this.sprite = fp;
        this.x = x;
        this.y = y;
    }

    /**
     * 更新实例的状态，需要子类实现
     */
    update() {
        throw Error('Item的实例方法update()未实现');
    }

    /**
     * 渲染到canvas
     * @param {number} d - y坐标修正因子
     */
    render(d = 0) {
        ctx.drawImage(Resources.get(this.sprite), this.x * 101, this.y * 83 - d);
    }
}

/**
 * Enemy类
 */
class Enemy extends Item {
    /**
     * Enemy构造函数
     * @constructor
     * @param {string} fp - 图像文件的相对位置
     * @param {number} y - enemy起始位置的y坐标，默认值为随机取1，2，3中的一个
     */
    constructor(fp = 'images/enemy-bug.png', y = Math.floor(Math.random() * 3) + 1) {
        let x = -1 * (1 + Math.floor(Math.random() * 10));
        super(fp, x, y);
        /**
         * enemy的移动速度，范围从1(最慢)到3(最快)的随机浮点数
         * @type {number}
         */
        this.speed = Math.random() * 2 + 1;
    }

    /**
     * enemy实例方法，更新enemy位置坐标
     * @param {number} dt - 时间间隙
     * @param {number} maxX - x方向的右边界
     */
    update(dt, maxX) {
        this.x += dt * this.speed;
        if (this.x > maxX) {
            // 提高enemy分布的随机程度
            this.x = -1 * (1 + Math.floor(Math.random() * 10));
        }
    }

    /**
     * enemy实例方法，绘制enemy
     */
    render() {
        super.render(22);
    }

    /**
     * enemy实例方法，碰撞检测
     * @param {Player} player - player实例
     * @param {number} d - 碰撞判定区域修正因子
     */
    checkCollision(player, d) {
        // 修正因子：从0（满格判定）到1（消除判定）的浮点数，消除素材对玩家视觉的影响
        // 碰撞判别一：player的起点落入enemy矩形框内，说明player的左边或上边有碰撞
        let isLeftIn = ((this.x + d <= player.x && player.x < this.x + 1 - d) && (this.y <= player.y && player.y < this.y + 1));
        // 碰撞判别二：enemy的起点落入player矩形框内，说明player的右边或下边有碰撞
        let isRightIn = ((player.x + d <= this.x && this.x < player.x + 1 - d) && (player.y <= this.y && this.y < player.y + 1));
        if (isLeftIn || isRightIn) {
            // 满足任意一个判别条件都说明存在碰撞，游戏失败
            // player.reset(maxX, maxY);
            player.status = 'dead';
        }
    }

    /**
     * enemy实例方法，重置enemy位置
     */
    reset() {
        this.x = -1 * (1 + Math.floor(Math.random() * 10));
        this.speed = Math.random() * 2 + 1;
    }
}

/**
 * Player类
 */
class Player extends Item {
    /**
     * Player构造函数
     * @constructor
     * @param {number} maxY - 底部边界
     */
    constructor(maxY = 5) {
        let fp = 'images/char-boy.png';
        let x = Math.floor(Math.random() * 5);
        let y = maxY
        super(fp, x, y);
        /**
         * player的x位移
         * @type {number}
         */
        this.dx = 0;
        /**
         * player的y位移
         * @type {number}
         */
        this.dy = 0;
        /**
         * player的状态: 'alive'存活，'win'胜利，'dead'失败
         * @type {string}
         */
        this.status = 'alive';
        /**
         * player获得分数
         * @type {number}
         */
        this.score = 0;
    }

    /**
     * player实例方法，更新player位置坐标
     * @param {number} minX,minY,maxX,maxY - player活动范围边界
     */
    update(...rect) {
        this.x += this.dx;
        // 左边边界
        if (this.x < rect[0]) {
            this.x = rect[0];
        }
        // 右边边界
        if (this.x > rect[2]) {
            this.x = rect[2];
        }
        this.dx = 0;
        this.y += this.dy;
        // 下边边界
        if (this.y > rect[3]) {
            this.y = rect[3];
        }
        // 上边边界，玩家到达终点
        if (this.y === rect[1]) {
            this.status = 'win';
            // this.reset(rect[2], rect[3]);
        }
        this.dy = 0;
    }

    /**
     * player实例方法，处理方向键输入
     * @param {string} dir - 移动方向
     */
    handleInput(dir) {
        if (player.status === 'alive') {
            switch (dir) {
                case 'left':
                    this.dx = -1;
                    break;
                case 'up':
                    this.dy = -1;
                    break;
                case 'right':
                    this.dx = 1;
                    break;
                case 'down':
                    this.dy = 1;
                    break;
                default:
                    break;
            }
        }
    }

    /**
     * player实例方法，绘制player
     */
    render() {
        super.render();
    }

    /**
     * player实例方法，把player放回起点
     * @param {number} maxX - player右边边界
     * @param {number} maxY - player底边边界
     */
    reset(maxX, maxY) {
        this.x = Math.floor(Math.random() * (maxX + 1));
        this.y = maxY;
        this.dx = this.dy = 0;
        this.status = 'alive';
        this.score = 0;
    }
}

/**
 * Gem类
 * player碰到宝石可以获得分数：蓝色1分，绿色2分，橙色3分
 */
class Gem extends Item {
    /**
     * Gem构造函数
     * @constructor
     * @param {number} type - 宝石类型,1蓝色,2绿色,3橙色
     * @param {number} x - 宝石初始位置x坐标
     * @param {number} y - 宝石初始位置y坐标
     */
    constructor(type, x, y) {
        let fp;
        switch (type) {
            case 1:
                fp = 'images/Gem Blue.png';
                break;
            case 2:
                fp = 'images/Gem Green.png';
                break;
            case 3:
                fp = 'images/Gem Orange.png';
                break;
            default:
                break;
        }
        super(fp, x, y);
        this.type = type;
        /**
         * gem属性，表示gem是否已经被player收集
         * @type {boolean}
         */
        this.isCollected = false;
    }

    /**
     * gem实例方法，碰撞检测
     * @param {Player} player - player实例
     */
    checkCollision(player) {
        let isLeftIn = ((this.x <= player.x && player.x < this.x + 1) && (this.y <= player.y && player.y < this.y + 1));
        let isRightIn = ((player.x <= this.x && this.x < player.x + 1) && (player.y <= this.y && this.y < player.y + 1));
        if (!this.isCollected && (player.status === 'alive') && (isLeftIn || isRightIn)) {
            player.score += this.type;
            this.isCollected = true; //  销毁宝石
        }

    }

    /**
     * gem实例方法，update
     */
    update() {}

    /**
     * gem实例方法，当gem的type不为0时渲染gem
     */
    render() {
        if (!this.isCollected) {
            super.render();
        }
    }

    /**
     * gem实例方法，重置gem
     */
    reset() {
        this.x = Math.floor(Math.random() * 5);
        this.isCollected = false;
    }

}

const allEnemies = [];
const allGems = [];
for (let i = 0; i < 7; i++) {
    let enemy;
    if (i < 3) {
        //保证每行石头上至少有一只虫子
        enemy = new Enemy(undefined, i + 1);
        let x = Math.floor(Math.random() * 5);
        allGems.push(new Gem(i + 1, x, 3 - i));
    } else {
        //多余的虫子，可用于调节难度
        enemy = new Enemy();
    }

    allEnemies.push(enemy);
}
const player = new Player();


// 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Play.handleInput()
// 方法里面。你不需要再更改这段代码了。
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    // 回车键重置游戏
    if (e.key === 'Enter' && player.status !== 'alive') {
        allEnemies.forEach(function(enemy) {
            enemy.reset();
        });
        allGems.forEach(function(gem) {
            gem.reset();
        });
        player.reset(4, 5);
    }

    player.handleInput(allowedKeys[e.keyCode]);
});