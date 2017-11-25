/**
 * Enemy类
 */
class Enemy {
    /**
     * Enemy构造函数
     * @constructor
     * @param {number} y - enemy起始位置的y坐标，默认值随机取1，2，3中的一个
     */
    constructor(y = Math.floor(Math.random() * 3) + 1) {
        /**
         * enemy图像文件，相对地址
         * @type {string}
         */
        this.sprite = 'images/enemy-bug.png';
        /**
         * enemy初始位置的x坐标，范围从-1到-5的随机整数
         * @type {number}
         */
        this.x = -1 * (1 + Math.floor(Math.random() * 5));
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
     */
    update(dt) {
        this.x += dt * this.speed;
        if (this.x > 5) {
            this.x = -1;
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
     * 碰撞判定方法：player的左上角落入enemy矩形框内，或player的右下角落入enemy矩形框内
     * @param {Player} player - player实例
     * @param {number} d - 修正碰撞判定区域因子，[0,1)
     */
    checkCollision(player, d) {
        let isLeftIn = ((this.x + d <= player.x && player.x < this.x + 1 - d) && (this.y <= player.y && player.y < this.y + 1));
        let isRightIn = ((player.x + d <= this.x && this.x < player.x + 1 - d) && (player.y <= this.y && this.y < player.y + 1));
        if (isLeftIn || isRightIn) {
            player.reset();
        } else {
            // console.log('false');
        }
    }
}

/**
 * Player类
 */
class Player {
    constructor() {
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
        this.y = 5;
        /**
         * player的x位移
         * @type {number}
         */
        this.dx = 0;
        /**
         * player的y位移
         * #type {number}
         */
        this.dy = 0;
    }

    /**
     * player实例方法，更新player位置坐标
     * @param {number} dx - x坐标的位移
     * @param {number} dy - y坐标的位移
     */
    update(dx, dy) {
        this.x += this.dx;
        if (this.x < 0) {
            this.x = 0;
        }
        if (this.x > 4) {
            this.x = 4;
        }
        this.dx = 0;
        this.y += this.dy;
        if (this.y > 5) {
            this.y = 5;
        }
        if (this.y === 0) {
            console.info('you win!');
            this.reset();
        }
        this.dy = 0;
    }

    /**
     * player实例方法，处理方向键输入
     * @param {string} dir - 移动方向
     */
    handleInput(dir) {
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

    /**
     * player实例方法，绘制player
     */
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x * 101, this.y * 83);
    }

    /**
     * player实例方法，player返回初始位置
     */
    reset() {
        this.x = Math.floor(Math.random() * 5);
        this.y = 5;
    }
}

const allEnemies = [];
for (let i = 0; i < 6; i++) {
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

    player.handleInput(allowedKeys[e.keyCode]);
});