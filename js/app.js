/**
 * Enemy类
 */
class Enemy {
    /**
     * Enemy构造函数
     * @constructor
     * @param {number} y - enemy起始位置的y坐标，默认值为随机取1，2，3中的一个
     */
    constructor(y = Math.floor(Math.random() * 3) + 1) {
        /**
         * enemy图像文件，相对地址
         * @type {string}
         */
        this.sprite = 'images/enemy-bug.png';
        /**
         * enemy初始位置的x坐标，范围从-1到-10的随机整数
         * 扩大enemy的间隔，分散enemy的分布
         * @type {number}
         */
        this.x = -1 * (1 + Math.floor(Math.random() * 10));
        /**
         * enemy初始位置的y坐标，1，2，3
         * @type {number}
         */
        this.y = y;
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
        ctx.drawImage(Resources.get(this.sprite), this.x * 101, this.y * 83 - 22);
    }

    /**
     * enemy实例方法，碰撞检测
     * @param {Player} player - player实例
     * @param {number} d - 碰撞判定区域修正因子
     * @param {number} maxX - player右边界
     * @param {number} maxY - player下边界
     */
    checkCollision(player, d, maxX, maxY) {
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
}

/**
 * Player类
 */
class Player {
    /**
     * Player构造函数
     * @constructor
     * @param {number} maxY - 底部边界
     */
    constructor(maxY = 5) {
        /**
         * player图片文件，相对地址
         * @type {string}
         */
        this.sprite = 'images/char-boy.png';
        /**
         * player初始位置的x坐标
         * @type {number}
         */
        this.x = Math.floor(Math.random() * 5);
        /**
         * player初始位置的y坐标
         * @type {number}
         */
        this.y = maxY;
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
        ctx.drawImage(Resources.get(this.sprite), this.x * 101, this.y * 83);
    }

    /**
     * player实例方法，把player放回起点
     * @param {number} maxX - player右边边界
     * @param {number} maxY - player底边边界
     */
    reset(maxX, maxY) {
        this.x = Math.floor(Math.random() * (maxX + 1));
        this.y = maxY;
    }
}

const allEnemies = [];
for (let i = 0; i < 9; i++) {
    let enemy;
    if (i < 3) {
        //保证每行石头上至少有一只虫子
        enemy = new Enemy(i + 1);
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
    // 回车键删除游戏结果弹框并恢复player
    if (e.key === 'Enter' && player.status !== 'alive') {
        player.status = 'alive';
        player.reset(4, 5);
    }

    player.handleInput(allowedKeys[e.keyCode]);
});